import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from '../entities/auth.entity';
import { Repository } from 'typeorm';
import { compareData, encodeData } from '../../common/utils/helpers.util';
import { SignUpDto } from '../dto/signup.dto';
import { EmailService } from '../../email/services/email.service';
import { User } from '../../user/entities/user.entity';
import { AccountPayload } from '../interfaces/auth.interface';
import { UserPermissionsService } from '../../user-permission/services/user-permissions.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userPermissionsService: UserPermissionsService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async findByUserId(id: string) {
    return await this.authRepository.findOne({ where: { user: { id: id } } });
  }

  async generateTokens(userId: string) {
    const accountExist = await this.authRepository.exists({
      where: { user: { id: userId } },
    });
    if (!accountExist) {
      this.logger.error(
        { [this.generateTokens.name]: { input: { userId: userId } } },
        'Account with user_id:`%s`, does not exist.',
        userId,
      );
      throw new BadRequestException('Invalid payload');
    }

    const signObject = { sub: userId };
    //generate the tokens
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(signObject, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
      }),
      this.jwtService.signAsync(signObject, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
      }),
    ]);

    // save the refresh token and keep track of last_login time
    const hashedRefreshToken = encodeData(refreshToken);

    const account = await this.findByUserId(userId);

    await this.authRepository.update(
      { id: account?.id },
      { refreshToken: hashedRefreshToken, lastLogin: new Date() },
    );

    return { accessToken, refreshToken };
  }

  async authenticate(email: string, password: string) {
    const account = await this.authRepository.findOne({
      where: { email: email },
      relations: ['user'],
    });

    if (!account) {
      this.logger.error(
        {
          [this.authenticate.name]: {
            input: { email },
          },
        },
        'Account with email:`%s` not found.',
        email,
      );
      throw new UnauthorizedException('Access not granted');
    }

    if (!account.active) {
      this.logger.error(
        {
          [this.authenticate.name]: {
            input: { email },
          },
        },
        'Account with id:`%s` is not active.',
        account.id,
      );
      throw new UnauthorizedException('Account not active');
    }

    const validPassword = compareData(password, account.password);
    if (!validPassword) {
      this.logger.error(
        {
          [this.authenticate.name]: {
            input: { email },
          },
        },
        'Invalid password for account with id:`%s`.',
        account.id,
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    return account.user;
  }

  async login(userId: string) {
    try {
      const tokens = await this.generateTokens(userId);

      return tokens;
    } catch (error) {
      if (error?.status) {
        throw error;
      }
      this.logger.error(
        { [this.login.name]: { input: { userId: userId } } },
        `Internal error, was not able to generate tokens for the account with user_id: \`${userId}\`, Thrown Error: {${JSON.stringify(
          error,
        )}}`,
      );
      throw new InternalServerErrorException('internal error');
    }
  }

  async register(registerDto: SignUpDto) {
    const { email, password, firstName, lastName } = registerDto;

    const existingAccount = await this.authRepository.findOne({
      where: { email: email },
    });

    if (existingAccount) {
      throw new ConflictException('This email is already registered');
    }

    try {
      const newUser = this.userRepository.create({
        email: email,
        firstName: firstName,
        lastName: lastName,
      });

      await this.userRepository.save(newUser);

      // Create default permissions for the new user
      await this.userPermissionsService.addPermissions(newUser.id, {
        permissions: ['user'],
        appName: ['theluxar']
      });

      const accountData = {
        email: email,
        password: encodeData(password),
        user: newUser,
      };

      const newAuth = this.authRepository.create(accountData);

      await this.authRepository.save(newAuth);

      const token = await this.jwtService.signAsync(
        { sub: newUser.id },
        {
          secret: process.env.ACTIVATION_SECRET,
          expiresIn: process.env.ACTIVATION_TOKEN_EXPIRATION,
        },
      );

      await this.emailService.sendAccountActivationEmail(email, token, 'accountActivation');

      return {
        message: 'Account created successfully. Please check your email to activate your account.',
      };
    } catch (error) {
      this.logger.error(
        { [this.register.name]: { input: registerDto } },
        'Error creating account',
        error?.stack,
      );

      throw new InternalServerErrorException('Error creating account');
    }
  }

  async activateAccount(token: string) {
    try {
      // Verify the token
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACTIVATION_SECRET,
      });

      // Find the account
      const account = await this.authRepository.findOne({
        where: { id: decoded.sub },
      });

      if (!account) {
        throw new NotFoundException('Account not found');
      }

      // Check if account is already active
      if (account.active) {
        throw new ConflictException('Account is already activated');
      }

      // Activate the account
      account.active = true;
      await this.authRepository.save(account);

      return { message: 'Account successfully activated' };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Activation token has expired');
      }
      throw error;
    }
  }

  async resendActivationEmail(email: string) {
    try {
      const account = await this.authRepository.findOne({
        where: { email },
      });

      if (!account) {
        throw new NotFoundException('Account not found');
      }

      if (account.active) {
        throw new ConflictException('Account is already activated');
      }

      // Generate a new activation token
      const activationToken = await this.jwtService.signAsync(
        { sub: account.id },
        {
          secret: process.env.ACTIVATION_SECRET,
          expiresIn: process.env.ACTIVATION_TOKEN_EXPIRATION,
        },
      );

      // Send the new activation email
      await this.emailService.sendAccountActivationEmail(
        email,
        activationToken,
        'accountActivation',
      );

      return { message: 'Activation email resent successfully' };
    } catch (error) {
      this.logger.error('Resend activation email error', error);
      throw error instanceof HttpException
        ? error
        : new InternalServerErrorException('Failed to resend activation email');
    }
  }

  async requestPasswordReset(email: string) {
    try {
      // Find the account by email
      const account = await this.authRepository.findOne({
        where: { email },
        relations: ['user'],
      });

      if (!account) {
        throw new NotFoundException('Account with this email does not exist');
      }

      // Generate a password reset token
      const resetToken = await this.jwtService.signAsync(
        { sub: account.user.id },
        {
          secret: process.env.RESET_PASSWORD_SECRET,
          expiresIn: process.env.RESET_PASSWORD_TOKEN_EXPIRATION || '1h',
        },
      );

      // Send the password reset email
      await this.emailService.sendPasswordResetEmail(
        email,
        resetToken,
        'passwordReset',
      );

      return { message: 'Password reset email sent successfully' };
    } catch (error) {
      this.logger.error(
        {
          function: 'requestPasswordReset',
          input: { email },
          method: 'POST',
        },
        `An error occurred when trying to request a password reset. Thrown Error : {${JSON.stringify(error)}}`,
      );

      throw error instanceof HttpException
        ? error
        : new InternalServerErrorException(
            'Failed to send password reset email',
          );
    }
  }

  async validateResetToken(token: string) {
    try {
      // Verify the token
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.RESET_PASSWORD_SECRET,
      });

      // Check if the account exists
      const account = await this.authRepository.findOne({
        where: { user: { id: decoded.sub } },
      });

      if (!account) {
        throw new NotFoundException('Account not found');
      }

      return decoded;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Password reset token has expired');
      }
      throw new UnauthorizedException('Invalid password reset token');
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      // Verify the token
      const decoded = await this.validateResetToken(token);

      // Find the account
      const account = await this.authRepository.findOne({
        where: { user: { id: decoded.sub } },
      });

      if (!account) {
        throw new NotFoundException('Account not found');
      }

      // Update the password
      account.password = await encodeData(newPassword);
      await this.authRepository.save(account);

      return { message: 'Password reset successfully' };
    } catch (error) {
      this.logger.error(
        {
          function: 'resetPassword',
          input: { token },
          method: 'POST',
        },
        `An error occurred when trying to reset the password. Thrown Error : {${JSON.stringify(error)}}`,
      );

      throw error;
    }
  }

  async refreshTokens(refreshToken: string) {
    try {
      // Verify the refresh token
      const decoded = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });

      const userId = decoded.sub;
      
      // Find the account
      const account = await this.findByUserId(userId);
      
      if (!account) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Verify stored refresh token matches the provided one
      const refreshTokenMatches = compareData(refreshToken, account.refreshToken);
      if (!refreshTokenMatches) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      return await this.generateTokens(userId);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token expired');
      }
      if (error?.status) {
        throw error;
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async registerFromAccount(accountPayload: AccountPayload): Promise<string> {
    try {
      // Check if account exists
      const accountExist = await this.authRepository.findOne({
        where: { email: accountPayload.email },
      });

      if (accountExist) {
        return accountExist.user.id;
      }

      // Create new User
      const user = this.userRepository.create({ email: accountPayload.email });
      await this.userRepository.save(user);

      // Create default permissions for the OAuth user
      await this.userPermissionsService.addPermissions(user.id, {
        permissions: ['user'],
        appName: ['theluxar']
      });

      // Create new account
      const newAccount = this.authRepository.create({
        email: accountPayload.email,
        active: true,
        user: user,
      });

      await this.authRepository.save(newAccount);

      return user.id;
    } catch (error) {
      this.logger.error('Registration from account error', error);
      throw new InternalServerErrorException('Failed to create account from OAuth');
    }
  }

  async getUserById(userId: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      return user;
    } catch (error) {
      this.logger.error(`Failed to get user by ID: ${userId}`, error);
      throw error instanceof HttpException
        ? error
        : new InternalServerErrorException('Failed to get user information');
    }
  }
}
