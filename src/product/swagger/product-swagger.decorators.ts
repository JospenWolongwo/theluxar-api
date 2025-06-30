import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

export function ApiCreateProduct() {
  return applyDecorators(
    ApiTags('products'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create a new product' }),
    ApiResponse({ status: 201, description: 'The product has been successfully created.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
  );
}

export function ApiFindAllProducts() {
  return applyDecorators(
    ApiTags('products'),
    ApiOperation({ summary: 'Get all products' }),
    ApiResponse({ status: 200, description: 'Return all products.' }),
  );
}

export function ApiSearchProducts() {
  return applyDecorators(
    ApiTags('products'),
    ApiOperation({ summary: 'Search products' }),
    ApiResponse({ status: 200, description: 'Return search results.' }),
  );
}

export function ApiFindOneProduct() {
  return applyDecorators(
    ApiTags('products'),
    ApiOperation({ summary: 'Get a product by id' }),
    ApiResponse({ status: 200, description: 'Return the product.' }),
    ApiResponse({ status: 404, description: 'Product not found.' }),
  );
}

export function ApiUpdateProduct() {
  return applyDecorators(
    ApiTags('products'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update a product' }),
    ApiResponse({ status: 200, description: 'The product has been successfully updated.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Product not found.' }),
  );
}

export function ApiRemoveProduct() {
  return applyDecorators(
    ApiTags('products'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete a product' }),
    ApiResponse({ status: 200, description: 'The product has been successfully deleted.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Product not found.' }),
  );
}
