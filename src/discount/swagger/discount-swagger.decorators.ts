import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

export function ApiCreateDiscount() {
  return applyDecorators(
    ApiTags('discounts'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create a new discount' }),
    ApiResponse({
      status: 201,
      description: 'The discount has been successfully created.',
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

export function ApiFindAllDiscounts() {
  return applyDecorators(
    ApiTags('discounts'),
    ApiOperation({ summary: 'Get all discounts' }),
    ApiResponse({
      status: 200,
      description: 'Return all discounts.',
    }),
  );
}

export function ApiFindDiscountsByStock() {
  return applyDecorators(
    ApiTags('discounts'),
    ApiOperation({ summary: 'Get discounts by stock ID' }),
    ApiResponse({
      status: 200,
      description: 'Return discounts by stock ID.',
    }),
  );
}

export function ApiFindOneDiscount() {
  return applyDecorators(
    ApiTags('discounts'),
    ApiOperation({ summary: 'Get a discount by id' }),
    ApiResponse({
      status: 200,
      description: 'Return the discount.',
    }),
    ApiResponse({
      status: 404,
      description: 'Discount not found.',
    }),
  );
}

export function ApiUpdateDiscount() {
  return applyDecorators(
    ApiTags('discounts'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update a discount' }),
    ApiResponse({
      status: 200,
      description: 'The discount has been successfully updated.',
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
      description: 'Discount not found.',
    }),
  );
}

export function ApiRemoveDiscount() {
  return applyDecorators(
    ApiTags('discounts'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete a discount' }),
    ApiResponse({
      status: 200,
      description: 'The discount has been successfully deleted.',
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
      description: 'Discount not found.',
    }),
  );
}
