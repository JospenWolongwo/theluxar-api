import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { ServiceCategory } from '../entities/service-category.entity';

export function ApiCreateServiceCategory() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create a new service category' }),
    ApiResponse({
      status: 201,
      description: 'The service category has been successfully created.',
      type: ServiceCategory,
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Invalid data provided.',
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

export function ApiFindAllServiceCategories() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all service categories' }),
    ApiResponse({
      status: 200,
      description: 'List of all service categories',
      type: [ServiceCategory],
    }),
  );
}

export function ApiFindOneServiceCategory() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a service category by ID' }),
    ApiParam({
      name: 'id',
      description: 'Service Category ID',
      required: true,
      type: String,
    }),
    ApiResponse({
      status: 200,
      description: 'The found service category',
      type: ServiceCategory,
    }),
    ApiResponse({
      status: 404,
      description: 'Service category not found',
    }),
  );
}

export function ApiUpdateServiceCategory() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update a service category' }),
    ApiParam({
      name: 'id',
      description: 'Service Category ID',
      required: true,
      type: String,
    }),
    ApiResponse({
      status: 200,
      description: 'The service category has been successfully updated.',
      type: ServiceCategory,
    }),
    ApiResponse({
      status: 404,
      description: 'Service category not found',
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

export function ApiRemoveServiceCategory() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete a service category' }),
    ApiParam({
      name: 'id',
      description: 'Service Category ID',
      required: true,
      type: String,
    }),
    ApiResponse({
      status: 204,
      description: 'The service category has been successfully deleted.',
    }),
    ApiResponse({
      status: 404,
      description: 'Service category not found',
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
