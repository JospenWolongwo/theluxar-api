import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Query,
  Res,
  UseGuards,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  ConflictException,
  Param,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { Csrf } from 'ncsrf';

import { OAuthRequest } from '../interfaces/auth.interface';
import { AuthService } from '../services/auth.service';
import {
  loginContext,
  signupContext,
  headerContext,
  tokenDisplayContext,
  signupConfirmationContext,
  forgotPasswordContext,
  resetPasswordContext,
  MAIN_URL,
} from '../../common/utils/auth.context';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { timeToMilliSeconds } from '../../common/utils/helpers.util';
import { AuthGuard } from '@nestjs/passport';
import { SignUpDto } from '../dto/signup.dto';
import { QueryRequired } from '../decorators/query-required.decorator';
import { AccessTokenGuard } from '../guards/access-token.guard';

interface RequestWithCsrf extends Request {
  csrfToken(): string;
}

interface RequestWithUser extends Request {
  user: {
    id?: string;
    sub?: string;
    [key: string]: any;
  };
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthController.name);

  private redirectUrl(redirect: string) {
    this.logger.debug(`Parsing redirect URL: ${redirect}`);
    this.logger.debug(
      `Using CLIENT_DELIMITER: ${process.env.CLIENT_DELIMITER}`,
    );
    this.logger.debug(`CLIENTS config: ${process.env.CLIENTS}`);
    
    const split = redirect.split(<string>process.env.CLIENT_DELIMITER);
    this.logger.debug(
      `Split result: [${split.join(', ')}], length: ${split.length}`,
    );

    const clients: Record<string, string> = JSON.parse(
      <string>process.env.CLIENTS,
    );
    this.logger.debug(`Parsed clients: ${JSON.stringify(clients)}`);

    if (split.length === 2) {
      if (split[0] in clients) {
        const result = clients[split[0]] + split[1];
        this.logger.debug(
          `Valid redirect URL found. Redirecting to: ${result}`,
        );
        return result;
      } else {
        this.logger.debug(
          `Client name '${split[0]}' not found in clients config`,
        );
      }
    } else {
      this.logger.debug(
        `Invalid split length: ${split.length}, expected 2 parts`,
      );
    }

    this.logger.debug('No valid redirect URL found, returning null');
    return null;
  }

  /**
   * Sets authentication cookies with appropriate security options
   * @param res Express response object
   * @param tokens Access and refresh tokens
   * @returns Response object with cookies set
   */
  private setTokenCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    // Create cookie options with proper types
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as
        | 'none'
        | 'lax'
        | 'strict',
    };

    return res
      .cookie('BAL_ess', tokens.accessToken, {
        ...cookieOptions,
        maxAge: timeToMilliSeconds(
          <string>process.env.ACCESS_TOKEN_EXPIRATION,
          'd',
        ),
      })
      .cookie('BAL_esh', tokens.refreshToken, {
        ...cookieOptions,
        maxAge: timeToMilliSeconds(
          <string>process.env.REFRESH_TOKEN_EXPIRATION,
          'd',
        ),
      });
  }

  private async handleOAuthCallback(
    req: OAuthRequest,
    res: Response,
    functionName: string,
  ) {
    try {
      const tokens = await this.authService.login(<string>req.user);

      const redirect = <string>req.cookies['redirect'];

      if (redirect?.length) {
        const redirectUrl = this.redirectUrl(redirect);

        if (redirectUrl?.length) {
          res = this.setTokenCookies(res, tokens);
          res.clearCookie('redirect').redirect(redirectUrl);
          return;
        }
      }

      // If no redirect URL, render the token-display view
      this.setTokenCookies(res, tokens);
      return res.render('auth/token-display', {
        ...tokenDisplayContext(tokens),
        header: headerContext('token-display'),
      });
    } catch (error) {
      if (error.status) {
        throw error;
      }
      this.logger.error(
        { function: functionName, input: { id: req.user }, method: 'GET' },
        `An error occurred when trying to login. Thrown Error : {${JSON.stringify(error)}}`,
      );
      throw new InternalServerErrorException('internal error');
    }
  }

  @Get('login')
  loginPage(
    @Query('redirect') redirect: string,
    @Req() req: RequestWithCsrf,
    @Res() res: Response,
  ) {
    const csrf = req.csrfToken();
    const loginPageContext = loginContext(redirect, csrf);
    const headerPageContext = headerContext('login');

    return res.render('auth/login', {
      ...loginPageContext,
      header: headerPageContext,
    });
  }

  @Get('signup')
  signUpPage(
    @Query('redirect') redirect: string,
    @Req() req: RequestWithCsrf,
    @Res() res: Response,
  ) {
    if (redirect !== undefined) {
      res = res.cookie('redirect', redirect);
    }

    const csrf = req.csrfToken();
    const signupPageContext = signupContext(redirect, csrf);
    const headerPageContext = headerContext('signup');

    return res.render('auth/signup', {
      ...signupPageContext,
      header: headerPageContext,
    });
  }

  @Get('confirm-email')
  async emailConfirmation(
    @QueryRequired('token') token: string,
    @Query('redirect') redirect: string,
    @Req() req: RequestWithCsrf,
    @Res() res: Response,
  ) {
    try {
      await this.authService.activateAccount(token);

      const loginUrl =
        redirect === undefined
          ? `${MAIN_URL}/auth/login`
          : `${MAIN_URL}/auth/login?redirect=${redirect}`;

      if (redirect !== undefined) {
        res = res.cookie('redirect', redirect);
      }

      const csrf = req.csrfToken();

      res.render('auth/confirmation', {
        ...signupConfirmationContext(
          'activation',
          loginUrl,
          `${MAIN_URL}/auth/resend-activation`,
          '',
          csrf,
        ),
        header: headerContext('login'),
      });
    } catch (error) {
      if (error.status) {
        throw error;
      }
      this.logger.error(
        {
          function: 'emailConfirmation',
          input: { token: token },
          method: 'GET',
        },
        `An error occurred when trying to send a confirmation email. Thrown Error : {${JSON.stringify(error)}}`,
      );
      throw new InternalServerErrorException('internal error');
    }
  }

  @Get('forgot-password')
  forgotPasswordPage(
    @Query('redirect') redirect: string,
    @Req() req: RequestWithCsrf,
    @Res() res: Response,
  ) {
    if (redirect !== undefined) {
      res = res.cookie('redirect', redirect);
    }

    const csrf = req.csrfToken();
    const forgotPasswordPageContext = forgotPasswordContext(redirect, csrf);
    const headerPageContext = headerContext('login');

    return res.render('auth/forgot-password', {
      ...forgotPasswordPageContext,
      header: headerPageContext,
    });
  }

  @Get('reset-password')
  async resetPasswordPage(
    @Query('token') token: string,
    @Query('redirect') redirect: string,
    @Req() req: RequestWithCsrf,
    @Res() res: Response,
  ) {
    try {
      // Verify the token to ensure it's valid
      await this.authService.validateResetToken(token);

      const csrf = req.csrfToken();
      const resetPasswordPageContext = resetPasswordContext(
        redirect,
        csrf,
        token,
      );
      const headerPageContext = headerContext('login');

      return res.render('auth/reset-password', {
        ...resetPasswordPageContext,
        header: headerPageContext,
      });
    } catch (error) {
      this.logger.error(
        {
          function: 'resetPasswordPage',
          input: { token },
          method: 'GET',
        },
        `An error occurred when trying to render the reset password page. Thrown Error : {${JSON.stringify(error)}}`,
      );

      const csrf = req.csrfToken();
      const loginUrl = `${MAIN_URL}/auth/login`;

      return res.status(error.status || 500).render('auth/confirmation', {
        ...signupConfirmationContext(
          'error',
          loginUrl,
          `${MAIN_URL}/auth/forgot-password`,
          '',
          csrf,
          error.message ||
            'Invalid or expired password reset link. Please request a new one.',
        ),
        header: headerContext('confirmation'),
      });
    }
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // Redirects to Google login page
  }

  @Get('login/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthenticationCallback(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.handleOAuthCallback(req, res, 'googleAuthenticationCallback');
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubLogin() {
    // Redirects to GitHub login page
  }

  @Get('login/github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthenticationCallback(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.handleOAuthCallback(req, res, 'githubAuthenticationCallback');
  }

  @Post('login')
  @Csrf()
  @Recaptcha()
  @UseGuards(AuthGuard('local'))
  async login(
    @Query('redirect') redirect: string,
    @Req() req: Request & { user: any },
    @Res() res: Response,
  ) {
    try {
      const user = req.user;
      this.logger.debug(`Login successful for user ID: ${user.id}`);
      this.logger.debug(`Redirect parameter received: ${redirect}`);
      
      const tokens = await this.authService.login(user.id);
      this.logger.debug('Tokens generated successfully');

      if (redirect?.length) {
        this.logger.debug(`Redirect parameter is present: ${redirect}`);
        const redirectUrl = this.redirectUrl(redirect);
        this.logger.debug(`Resolved redirect URL: ${redirectUrl || 'null'}`);
        
        if (redirectUrl) {
          this.logger.debug(
            `Setting cookies and returning redirect URL: ${redirectUrl}`,
          );
          this.setTokenCookies(res, tokens);
          // Instead of redirect, send JSON response with redirect URL
          return res.status(200).json({
            success: true,
            redirectUrl: redirectUrl,
          });
        } else {
          this.logger.debug(
            'Invalid redirect URL, falling back to token display',
          );
        }
      } else {
        this.logger.debug(
          'No redirect parameter found, rendering token display view',
        );
      }

      this.setTokenCookies(res, tokens);
      return res.render('auth/token-display', {
        ...tokenDisplayContext(tokens),
        header: headerContext('token-display'),
      });
    } catch (error) {
      console.error('Login error:', error);

      // Handle CSRF errors specifically
      if (error.name === 'ForbiddenError' || error.code === 'EBADCSRFTOKEN') {
        return res.status(403).json({
          success: false,
          message: 'Session expired. Please refresh the page and try again.',
        });
      }

      // Generic error response
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  @Post('signup')
  @Csrf()
  async signup(
    @Query('redirect') redirect: string,
    @Body() signUpDto: SignUpDto,
    @Req() req: RequestWithCsrf,
    @Res() res: Response,
  ) {
    try {
      await this.authService.register(signUpDto);

      const loginUrl =
        redirect === undefined
          ? `${MAIN_URL}/auth/login`
          : `${MAIN_URL}/auth/login?redirect=${redirect}`;

      const csrf = req.csrfToken();

      res.render('auth/confirmation', {
        ...signupConfirmationContext(
          'signup',
          loginUrl,
          `${MAIN_URL}/auth/resend-activation`,
          signUpDto.email,
          csrf,
        ),
        header: headerContext('confirmation'),
      });
    } catch (error) {
      if (error.status) {
        throw error;
      }
      console.error(
        { function: 'signup', input: { signUpDto }, method: 'POST' },
        `An error occurred when trying to register. Thrown Error : {${JSON.stringify(error)}}`,
      );
      throw new InternalServerErrorException('internal error');
    }
  }

  @Post('resend-activation')
  @Csrf()
  async resendActivation(
    @Body('email') email: string,
    @Res() res: Response,
    @Req() req: RequestWithCsrf,
  ) {
    const csrf = req.csrfToken();
    try {
      await this.authService.resendActivationEmail(email);

      res.render('auth/confirmation', {
        ...signupConfirmationContext(
          'resend',
          `${MAIN_URL}/login`,
          `${MAIN_URL}/auth/resend-activation`,
          email,
          csrf,
        ),
        header: headerContext('confirmation'),
      });
    } catch (error) {
      this.logger.error(
        {
          function: 'resendActivation',
          input: { email },
          method: 'POST',
        },
        `An error occurred when trying to resend activation email. Thrown Error : {${JSON.stringify(error)}}`,
      );

      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        return res.status(error.getStatus()).render('auth/confirmation', {
          ...signupConfirmationContext(
            'error',
            `${MAIN_URL}/signup`,
            `${MAIN_URL}/auth/resend-activation`,
            email,
            csrf,
          ),
          header: headerContext('confirmation'),
        });
      }

      // Handle generic errors
      return res.status(500).render('auth/confirmation', {
        ...signupConfirmationContext(
          'error',
          `${MAIN_URL}/auth/signup`,
          `${MAIN_URL}/auth/resend-activation`,
          email,
          csrf,
          'An unexpected error occurred. Please try again later.',
        ),
        header: headerContext('confirmation'),
      });
    }
  }

  @Post('forgot-password')
  @Csrf()
  @Recaptcha()
  async requestPasswordReset(
    @Body('email') email: string,
    @Res() res: Response,
    @Req() req: RequestWithCsrf,
  ) {
    try {
      await this.authService.requestPasswordReset(email);

      const csrf = req.csrfToken();
      const loginUrl = `${MAIN_URL}/auth/login`;

      return res.render('auth/confirmation', {
        ...signupConfirmationContext(
          'password-reset',
          loginUrl,
          `${MAIN_URL}/auth/forgot-password`,
          email,
          csrf,
          'A password reset email has been sent to your inbox. Please check your email to reset your password.',
        ),
        header: headerContext('confirmation'),
      });
    } catch (error) {
      this.logger.error(
        {
          function: 'requestPasswordReset',
          input: { email },
          method: 'POST',
        },
        `An error occurred when trying to request a password reset. Thrown Error : {${JSON.stringify(error)}}`,
      );

      const csrf = req.csrfToken();
      const loginUrl = `${MAIN_URL}/auth/login`;

      return res.status(error.status || 500).render('auth/confirmation', {
        ...signupConfirmationContext(
          'error',
          loginUrl,
          `${MAIN_URL}/auth/forgot-password`,
          email,
          csrf,
          error.message || 'An unexpected error occurred. Please try again.',
        ),
        header: headerContext('confirmation'),
      });
    }
  }

  /**
   * Endpoint for refreshing access token using the refresh token
   * @param req Request object containing cookies
   * @param res Response object for setting new cookies
   * @returns New token pair or error response
   */
  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    try {
      const refreshToken = req.cookies['BAL_esh'];
      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token not found' });
      }

      try {
        // Verify the refresh token is valid
        await this.jwtService.verifyAsync(refreshToken, {
          secret: process.env.JWT_SECRET,
        });

        // If valid, generate new tokens
        const tokens = await this.authService.refreshTokens(refreshToken);
        this.setTokenCookies(res, tokens);

        // Return tokens in response (for non-browser clients)
        return res.status(200).json({
          message: 'Token refreshed successfully',
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
      } catch (error) {
        this.logger.error(`Token refresh failed: ${error.message}`);

        // Token is invalid or expired - clear cookies
        const cookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as
            | 'none'
            | 'lax'
            | 'strict',
        };
        res.clearCookie('BAL_ess', cookieOptions);
        res.clearCookie('BAL_esh', cookieOptions);
        return res.status(401).json({ message: 'Invalid refresh token' });
      }
    } catch (error) {
      this.logger.error(
        { function: 'refreshToken', method: 'POST' },
        `An error occurred during token refresh. Thrown Error: {${JSON.stringify(error)}}`,
      );
      return res.status(500).json({ message: 'Failed to refresh token' });
    }
  }

  /**
   * Logout endpoint to clear authentication cookies
   */
  @Post('logout')
  async logout(@Res() res: Response) {
    try {
      // Define consistent cookie security options
      // Define cookie options with proper TypeScript type for sameSite
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as
          | 'none'
          | 'lax'
          | 'strict',
      };

      // Clear all authentication cookies
      res.clearCookie('BAL_ess', cookieOptions);
      res.clearCookie('BAL_esh', cookieOptions);

      return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      this.logger.error(
        { function: 'logout', method: 'POST' },
        `An error occurred during logout. Thrown Error: {${JSON.stringify(error)}}`,
      );
      return res.status(500).json({ message: 'Failed to logout' });
    }
  }

  @Post('reset-password')
  @Csrf()
  @Recaptcha()
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
    @Res() res: Response,
    @Req() req: RequestWithCsrf,
  ) {
    try {
      await this.authService.resetPassword(token, newPassword);

      const csrf = req.csrfToken();
      const loginUrl = `${MAIN_URL}/auth/login`;

      return res.render('auth/confirmation', {
        ...signupConfirmationContext(
          'password-reset-success',
          loginUrl,
          `${MAIN_URL}/auth/login`,
          '',
          csrf,
          'Your password has been reset successfully. You can now log in with your new password.',
        ),
        header: headerContext('confirmation'),
      });
    } catch (error) {
      this.logger.error(
        {
          function: 'resetPassword',
          input: { token },
          method: 'POST',
        },
        `An error occurred when trying to reset the password. Thrown Error : {${JSON.stringify(error)}}`,
      );

      const csrf = req.csrfToken();
      const loginUrl = `${MAIN_URL}/auth/login`;

      return res.status(error.status || 500).render('auth/confirmation', {
        ...signupConfirmationContext(
          'error',
          loginUrl,
          `${MAIN_URL}/auth/forgot-password`,
          '',
          csrf,
          error.message || 'An unexpected error occurred. Please try again.',
        ),
        header: headerContext('confirmation'),
      });
    }
  }

  @Get('verify')
  @UseGuards(AccessTokenGuard)
  async verifySession(@Req() req: RequestWithUser, @Res() res: Response) {
    // Ensure we always respond with JSON
    res.setHeader('Content-Type', 'application/json');
    
    try {
      // The AccessTokenGuard ensures the token is valid
      // We just need to return the user ID from the token
      const userId = req.user?.id || req.user?.sub;
      
      if (!userId) {
        throw new InternalServerErrorException('User ID not found in token');
      }

      return res.status(200).json({
        userId,
        valid: true
      });
    } catch (error) {
      this.logger.error(
        { function: 'verifySession', method: 'GET' },
        `Session verification failed: ${JSON.stringify(error)}`,
      );
      
      return res.status(401).json({
        userId: null,
        valid: false,
        error: 'Session verification failed'
      });
    }
  }

  @Get('user/:id')
  @UseGuards(AccessTokenGuard)
  async getUserInfo(@Param('id') id: string, @Req() req: RequestWithUser) {
    try {
      // Verify that the user is requesting their own information
      const tokenUserId = req.user?.id || req.user?.sub;

      if (tokenUserId !== id) {
        throw new InternalServerErrorException(
          'Unauthorized access to user information',
        );
      }

      // Get user information from the auth service
      const user = await this.authService.getUserById(id);

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      this.logger.error(
        { function: 'getUserInfo', input: { id }, method: 'GET' },
        `Failed to get user info: ${JSON.stringify(error)}`,
      );
      throw new InternalServerErrorException('Failed to get user information');
    }
  }
}
