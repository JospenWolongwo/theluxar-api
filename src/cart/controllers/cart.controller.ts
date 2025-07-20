import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CartService } from '../services/cart.service';
import { CreateCartDto } from '../dto/create-cart.dto';
import { UpdateCartDto } from '../dto/update-cart.dto';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { CreateCartItemDto } from '../dto/create-cart-item.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import {
  ApiCreateCart,
  ApiFindAllCarts,
  ApiFindOneCart,
  ApiFindUserCart,
  ApiUpdateCart,
  ApiRemoveCart,
  ApiAddItemToCart,
  ApiUpdateCartItem,
  ApiRemoveItemFromCart,
  ApiEmptyCart,
} from '../swagger/cart-swagger.decorators';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiCreateCart()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiFindAllCarts()
  findAll() {
    return this.cartService.findAll();
  }

  @Get('user/:userId')
  @UseGuards(AccessTokenGuard)
  @ApiFindUserCart()
  findByUser(@Param('userId') userId: string) {
    return this.cartService.findByUser(userId);
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  @ApiFindOneCart()
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @ApiUpdateCart()
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @ApiRemoveCart()
  remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }

  @Post(':id/items')
  @UseGuards(AccessTokenGuard)
  @ApiAddItemToCart()
  addItemToCart(
    @Param('id') id: string,
    @Body() createCartItemDto: CreateCartItemDto,
  ) {
    return this.cartService.addItemToCart(id, createCartItemDto);
  }

  @Patch(':id/items/:itemId')
  @UseGuards(AccessTokenGuard)
  @ApiUpdateCartItem()
  updateCartItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(id, itemId, updateCartItemDto);
  }

  @Delete(':id/items/:itemId')
  @UseGuards(AccessTokenGuard)
  @ApiRemoveItemFromCart()
  removeCartItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    return this.cartService.removeCartItem(id, itemId);
  }

  @Delete(':id/items')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiEmptyCart()
  clearCart(@Param('id') id: string) {
    return this.cartService.clearCart(id);
  }
}
