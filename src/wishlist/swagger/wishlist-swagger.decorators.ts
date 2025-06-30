import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { Wishlist } from '../entities/wishlist.entity';
import { WishlistItem } from '../entities/wishlist-item.entity';

export function ApiCreateWishlist() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create a new wishlist' }),
    ApiResponse({
      status: 201,
      description: 'The wishlist has been successfully created.',
      type: Wishlist,
    }),
    ApiResponse({
      status: 409,
      description: 'User already has a wishlist',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - requires admin role',
    }),
  );
}

export function ApiFindAllWishlists() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get all wishlists' }),
    ApiResponse({
      status: 200,
      description: 'List of all wishlists',
      type: [Wishlist],
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - requires admin role',
    }),
  );
}

export function ApiFindWishlistByUser() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get wishlist for current user' }),
    ApiResponse({
      status: 200,
      description: 'The wishlist for the current authenticated user',
      type: Wishlist,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
  );
}

export function ApiFindOneWishlist() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get a wishlist by ID' }),
    ApiParam({
      name: 'id',
      description: 'Wishlist ID',
      required: true,
      type: String,
    }),
    ApiResponse({
      status: 200,
      description: 'The found wishlist',
      type: Wishlist,
    }),
    ApiResponse({
      status: 404,
      description: 'Wishlist not found',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
  );
}

export function ApiUpdateWishlist() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update a wishlist' }),
    ApiParam({
      name: 'id',
      description: 'Wishlist ID',
      required: true,
      type: String,
    }),
    ApiResponse({
      status: 200,
      description: 'The wishlist has been successfully updated.',
      type: Wishlist,
    }),
    ApiResponse({
      status: 404,
      description: 'Wishlist not found',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - requires admin role',
    }),
  );
}

export function ApiRemoveWishlist() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete a wishlist' }),
    ApiParam({
      name: 'id',
      description: 'Wishlist ID',
      required: true,
      type: String,
    }),
    ApiResponse({
      status: 204,
      description: 'The wishlist has been successfully deleted.',
    }),
    ApiResponse({
      status: 404,
      description: 'Wishlist not found',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - requires admin role',
    }),
  );
}

export function ApiAddItemToWishlist() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Add an item to a wishlist' }),
    ApiParam({
      name: 'id',
      description: 'Wishlist ID',
      required: true,
      type: String,
    }),
    ApiResponse({
      status: 201,
      description: 'Item has been successfully added to the wishlist.',
      type: WishlistItem,
    }),
    ApiResponse({
      status: 404,
      description: 'Wishlist not found',
    }),
    ApiResponse({
      status: 409,
      description: 'Item already exists in the wishlist',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
  );
}

export function ApiRemoveItemFromWishlist() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Remove an item from a wishlist' }),
    ApiParam({
      name: 'wishlistId',
      description: 'Wishlist ID',
      required: true,
      type: String,
    }),
    ApiParam({
      name: 'itemId',
      description: 'Wishlist Item ID',
      required: true,
      type: String,
    }),
    ApiResponse({
      status: 204,
      description: 'Item has been successfully removed from the wishlist.',
    }),
    ApiResponse({
      status: 404,
      description: 'Wishlist or wishlist item not found',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
  );
}

export function ApiClearWishlist() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Clear all items from a wishlist' }),
    ApiParam({
      name: 'id',
      description: 'Wishlist ID',
      required: true,
      type: String,
    }),
    ApiResponse({
      status: 204,
      description: 'The wishlist has been successfully cleared of all items.',
    }),
    ApiResponse({
      status: 404,
      description: 'Wishlist not found',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
  );
}
