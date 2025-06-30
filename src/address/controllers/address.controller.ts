import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { AddressService } from '../services/address.service';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { ApiTags } from '@nestjs/swagger';
import { AddressType } from '../enums/address-type.enum';
import {
  ApiCreateAddress,
  ApiFindAllAddresses,
  ApiFindAddressesByUser,
  ApiFindAddressesByType,
  ApiFindOneAddress,
  ApiUpdateAddress,
  ApiSetDefaultAddress,
  ApiRemoveAddress,
} from '../swagger/address-swagger.decorators';
import { AuthContext } from '../../auth/utils/auth.context';

@ApiTags('Address')
@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiCreateAddress()
  create(@Body() createAddressDto: CreateAddressDto, @Request() req) {
    // If userId is not provided in the DTO, use the authenticated user's ID
    if (!createAddressDto.userId) {
      createAddressDto.userId = AuthContext.getUserId(req);
    } else {
      // Ensure regular users can only create addresses for themselves
      const currentUserId = AuthContext.getUserId(req);
      const isAdmin = AuthContext.hasRole(req, 'admin');
      
      if (!isAdmin && createAddressDto.userId !== currentUserId) {
        createAddressDto.userId = currentUserId; // Override with authenticated user's ID
      }
    }
    
    return this.addressService.create(createAddressDto);
  }

  @Get()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @ApiFindAllAddresses()
  findAll() {
    return this.addressService.findAll();
  }

  @Get('my-addresses')
  @UseGuards(AccessTokenGuard)
  @ApiFindAddressesByUser()
  findMyAddresses(@Request() req) {
    const userId = AuthContext.getUserId(req);
    return this.addressService.findByUser(userId);
  }

  @Get('my-addresses/by-type')
  @UseGuards(AccessTokenGuard)
  @ApiFindAddressesByType()
  findMyAddressesByType(@Request() req, @Query('type') type: AddressType) {
    const userId = AuthContext.getUserId(req);
    return this.addressService.findByUserAndType(userId, type);
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  @ApiFindOneAddress()
  async findOne(@Param('id') id: string, @Request() req) {
    const address = await this.addressService.findOne(id);
    
    // Ensure users can only access their own addresses, unless they're an admin
    const isAdmin = AuthContext.hasRole(req, 'admin');
    const currentUserId = AuthContext.getUserId(req);
    
    if (!isAdmin && address.userId !== currentUserId) {
      throw new Error('Forbidden: You can only access your own addresses');
    }
    
    return address;
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @ApiUpdateAddress()
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @Request() req
  ) {
    // First get the address to check ownership
    const address = await this.addressService.findOne(id);
    
    // Ensure users can only update their own addresses, unless they're an admin
    const isAdmin = AuthContext.hasRole(req, 'admin');
    const currentUserId = AuthContext.getUserId(req);
    
    if (!isAdmin && address.userId !== currentUserId) {
      throw new Error('Forbidden: You can only update your own addresses');
    }
    
    // If userId is in the DTO and user is not an admin, ensure they can't change the owner
    if (updateAddressDto.userId && !isAdmin && updateAddressDto.userId !== currentUserId) {
      updateAddressDto.userId = currentUserId; // Override with authenticated user's ID
    }
    
    return this.addressService.update(id, updateAddressDto);
  }

  @Patch(':id/set-default')
  @UseGuards(AccessTokenGuard)
  @ApiSetDefaultAddress()
  async setDefault(@Param('id') id: string, @Request() req) {
    // First get the address to check ownership
    const address = await this.addressService.findOne(id);
    
    // Ensure users can only update their own addresses, unless they're an admin
    const isAdmin = AuthContext.hasRole(req, 'admin');
    const currentUserId = AuthContext.getUserId(req);
    
    if (!isAdmin && address.userId !== currentUserId) {
      throw new Error('Forbidden: You can only modify your own addresses');
    }
    
    return this.addressService.setAsDefault(id);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRemoveAddress()
  async remove(@Param('id') id: string, @Request() req) {
    // First get the address to check ownership
    const address = await this.addressService.findOne(id);
    
    // Ensure users can only delete their own addresses, unless they're an admin
    const isAdmin = AuthContext.hasRole(req, 'admin');
    const currentUserId = AuthContext.getUserId(req);
    
    if (!isAdmin && address.userId !== currentUserId) {
      throw new Error('Forbidden: You can only delete your own addresses');
    }
    
    return this.addressService.remove(id);
  }
}
