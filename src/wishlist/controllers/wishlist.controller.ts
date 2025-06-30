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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { WishlistService } from '../services/wishlist.service';
import { CreateWishlistDto } from '../dto/create-wishlist.dto';
import { UpdateWishlistDto } from '../dto/update-wishlist.dto';
import { CreateWishlistItemDto } from '../dto/create-wishlist-item.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiCreateWishlist,
  ApiFindAllWishlists,
  ApiFindOneWishlist,
  ApiFindWishlistByUser,
  ApiUpdateWishlist,
  ApiRemoveWishlist,
  ApiAddItemToWishlist,
  ApiRemoveItemFromWishlist,
  ApiClearWishlist,
} from '../swagger/wishlist-swagger.decorators';
import { AuthContext } from '../../auth/utils/auth.context';

@ApiTags('Wishlist')
@Controller('wishlists')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @ApiCreateWishlist()
  create(@Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistService.create(createWishlistDto);
  }

  @Get()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @ApiFindAllWishlists()
  findAll() {
    return this.wishlistService.findAll();
  }

  @Get('user')
  @UseGuards(AccessTokenGuard)
  @ApiFindWishlistByUser()
  findByUser(@Request() req) {
    const userId = AuthContext.getUserId(req);
    return this.wishlistService.createForUserIfNotExists(userId);
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  @ApiFindOneWishlist()
  findOne(@Param('id') id: string, @Request() req) {
    return this.wishlistService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @ApiUpdateWishlist()
  update(@Param('id') id: string, @Body() updateWishlistDto: UpdateWishlistDto) {
    return this.wishlistService.update(id, updateWishlistDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRemoveWishlist()
  remove(@Param('id') id: string) {
    return this.wishlistService.remove(id);
  }

  @Post(':id/items')
  @UseGuards(AccessTokenGuard)
  @ApiAddItemToWishlist()
  addItem(
    @Param('id') id: string,
    @Body() createWishlistItemDto: CreateWishlistItemDto,
  ) {
    return this.wishlistService.addItemToWishlist(id, createWishlistItemDto);
  }

  @Delete(':wishlistId/items/:itemId')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRemoveItemFromWishlist()
  removeItem(
    @Param('wishlistId') wishlistId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.wishlistService.removeItemFromWishlist(wishlistId, itemId);
  }

  @Delete(':id/items')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiClearWishlist()
  clearWishlist(@Param('id') id: string) {
    return this.wishlistService.clearWishlist(id);
  }
}
