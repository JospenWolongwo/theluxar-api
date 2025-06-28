import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { getAppPermissions } from '../utils/getAppPermissions';
import { getAppPermissionsValues } from '../utils/getAppPermissionValues';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from '../../common/decorators/requirePermissions.decorator';
import { PermissionsGuard } from '../../common/guards/permission.guard';
import { ValidateNotEmptyPipe } from '../../common/utils/validateNotEmpty.pipe';
import { UserService } from '../../user/services/user.service';
import { CreateUserPermissionDto } from '../dto/create-user-permission.dto';
import { UserPermissionsService } from '../../user-permission/services/user-permissions.service';

@ApiTags('Permissions')
@ApiBearerAuth()
@Controller('permissions')
@UseInterceptors(ClassSerializerInterceptor)
export class UserPermissionsController {
  constructor(
    private readonly userPermissionsService: UserPermissionsService,
    private readonly userService: UserService,
  ) {}

  @Post(':id')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['AddPermissions'])
  async addPermissions(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidateNotEmptyPipe())
    createUserPermissionDto: CreateUserPermissionDto,
  ) {
    try {
      const userToUpdate = await this.userService.findById(id);

      if (userToUpdate.id) {
        return await this.userPermissionsService.addPermissions(
          id,
          createUserPermissionDto,
        );
      }
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['RevokePermissions'])
  async revokePermissions(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidateNotEmptyPipe())
    revokePermissionDto: CreateUserPermissionDto,
  ) {
    try {
      const userToUpdate = await this.userService.findById(id);

      if (userToUpdate.id) {
        return await this.userPermissionsService.revokePermissions(
          id,
          revokePermissionDto,
        );
      }
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }

  @Get('user/:id/:appName')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['ReadUsers'])
  async getUserPermissions(
    @Param('id', new ParseUUIDPipe()) userId: string,
    @Param('appName') appName: string,
  ) {
    try {
      const userPermissions = await this.userPermissionsService.getUserPermissions(userId);
      if (!userPermissions) {
        return { permissions: [] };
      }

      // Filter permissions to only include those for the specified app
      const appPermissions = userPermissions.permissions
        .filter(permission => permission.startsWith(`${appName}_`));

      return { permissions: appPermissions };
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to retrieve user permissions');
    }
  }

  @Get('my/:appName')
  @UseGuards(AuthGuard('accessToken'))
  async getMyPermissions(
    @Param('appName') appName: string,
    @Req() req: any,
  ) {
    try {
      const userId = req.user.sub;
      if (!userId) {
        throw new InternalServerErrorException('User not authenticated properly');
      }

      const userPermissions = await this.userPermissionsService.getUserPermissions(userId);
      if (!userPermissions) {
        return { permissions: [] };
      }

      // Filter permissions to only include those for the specified app
      const appPermissions = userPermissions.permissions
        .filter(permission => permission.startsWith(`${appName}_`));

      return { permissions: appPermissions };
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to retrieve your permissions');
    }
  }

  @Get('app/:appName/values')
  async getAppPermissionsValues(@Param('appName') appName: string) {
    try {
      const permissionValues = getAppPermissionsValues(appName);
      return { permissions: permissionValues };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve app permission values');
    }
  }

  @Get('app/:appName')
  async getAppPermissions(@Param('appName') appName: string) {
    try {
      const permissions = getAppPermissions(appName);
      
      if (!permissions) {
        return { permissions: {} };
      }
      
      return { permissions };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve app permissions');
    }
  }
}
