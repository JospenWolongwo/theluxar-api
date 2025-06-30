import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

export function ApiCreateCart() {
  return applyDecorators(
    ApiTags('cart'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create a new cart' }),
    ApiResponse({
      status: 201,
      description: 'The cart has been successfully created.',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized.',
    }),
  );
}

export function ApiFindAllCarts() {
  return applyDecorators(
    ApiTags('cart'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get all carts (Admin only)' }),
    ApiResponse({
      status: 200,
      description: 'Return all carts.',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized.',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden.',
    }),
  );
}

export function ApiFindUserCart() {
  return applyDecorators(
    ApiTags('cart'),
    ApiBearerAuth(),
    ApiOperation({ summary: "Get current user's cart" }),
    ApiResponse({
      status: 200,
      description: "Return the user's cart.",
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized.',
    }),
    ApiResponse({
      status: 404,
      description: 'Cart not found.',
    }),
  );
}

export function ApiFindOneCart() {
  return applyDecorators(
    ApiTags('cart'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get a cart by id' }),
    ApiResponse({
      status: 200,
      description: 'Return the cart.',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized.',
    }),
    ApiResponse({
      status: 404,
      description: 'Cart not found.',
    }),
  );
}

export function ApiUpdateCart() {
  return applyDecorators(
    ApiTags('cart'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update a cart' }),
    ApiResponse({
      status: 200,
      description: 'The cart has been successfully updated.',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized.',
    }),
    ApiResponse({
      status: 404,
      description: 'Cart not found.',
    }),
  );
}

export function ApiAddItemToCart() {
  return applyDecorators(
    ApiTags('cart'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Add item to cart' }),
    ApiResponse({
      status: 200,
      description: 'The item has been added to cart.',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized.',
    }),
    ApiResponse({
      status: 404,
      description: 'Cart not found.',
    }),
  );
}

export function ApiRemoveItemFromCart() {
  return applyDecorators(
    ApiTags('cart'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Remove item from cart' }),
    ApiResponse({
      status: 200,
      description: 'The item has been removed from cart.',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized.',
    }),
    ApiResponse({
      status: 404,
      description: 'Cart or cart item not found.',
    }),
  );
}

export function ApiUpdateCartItem() {
  return applyDecorators(
    ApiTags('cart'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update cart item quantity' }),
    ApiResponse({
      status: 200,
      description: 'The cart item has been updated.',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized.',
    }),
    ApiResponse({
      status: 404,
      description: 'Cart item not found.',
    }),
  );
}

export function ApiEmptyCart() {
  return applyDecorators(
    ApiTags('cart'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Empty cart' }),
    ApiResponse({
      status: 200,
      description: 'The cart has been emptied.',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized.',
    }),
    ApiResponse({
      status: 404,
      description: 'Cart not found.',
    }),
  );
}

export function ApiRemoveCart() {
  return applyDecorators(
    ApiTags('cart'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete a cart' }),
    ApiResponse({
      status: 200,
      description: 'The cart has been successfully deleted.',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized.',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden.',
    }),
    ApiResponse({
      status: 404,
      description: 'Cart not found.',
    }),
  );
}
