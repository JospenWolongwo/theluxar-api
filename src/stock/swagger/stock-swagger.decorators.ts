import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

export function ApiCreateStock() {
  return applyDecorators(
    ApiTags('stocks'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create a new stock' }),
    ApiResponse({
      status: 201,
      description: 'The stock has been successfully created.',
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

export function ApiFindAllStocks() {
  return applyDecorators(
    ApiTags('stocks'),
    ApiOperation({ summary: 'Get all stocks' }),
    ApiResponse({
      status: 200,
      description: 'Return all stocks.',
    }),
  );
}

export function ApiFindStocksByProduct() {
  return applyDecorators(
    ApiTags('stocks'),
    ApiOperation({ summary: 'Get stocks by product ID' }),
    ApiResponse({
      status: 200,
      description: 'Return stocks by product ID.',
    }),
  );
}

export function ApiFindOneStock() {
  return applyDecorators(
    ApiTags('stocks'),
    ApiOperation({ summary: 'Get a stock by id' }),
    ApiResponse({
      status: 200,
      description: 'Return the stock.',
    }),
    ApiResponse({
      status: 404,
      description: 'Stock not found.',
    }),
  );
}

export function ApiUpdateStock() {
  return applyDecorators(
    ApiTags('stocks'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update a stock' }),
    ApiResponse({
      status: 200,
      description: 'The stock has been successfully updated.',
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
      description: 'Stock not found.',
    }),
  );
}

export function ApiRemoveStock() {
  return applyDecorators(
    ApiTags('stocks'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete a stock' }),
    ApiResponse({
      status: 200,
      description: 'The stock has been successfully deleted.',
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
      description: 'Stock not found.',
    }),
  );
}
