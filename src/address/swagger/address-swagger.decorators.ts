import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { Address } from '../entities/address.entity';
import { AddressType } from '../enums/address-type.enum';

export function ApiCreateAddress() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create a new address' }),
    ApiResponse({
      status: 201,
      description: 'The address has been successfully created.',
      type: Address,
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Invalid data provided.',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
  );
}

export function ApiFindAllAddresses() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get all addresses' }),
    ApiResponse({
      status: 200,
      description: 'List of all addresses',
      type: [Address],
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

export function ApiFindAddressesByUser() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get addresses for current user' }),
    ApiResponse({
      status: 200,
      description: 'Addresses for the current authenticated user',
      type: [Address],
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
  );
}

export function ApiFindAddressesByType() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get addresses for current user by type' }),
    ApiQuery({
      name: 'type',
      description: 'Address type filter',
      enum: AddressType,
      required: true,
    }),
    ApiResponse({
      status: 200,
      description: 'Addresses for the current authenticated user filtered by type',
      type: [Address],
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
  );
}

export function ApiFindOneAddress() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get an address by ID' }),
    ApiParam({
      name: 'id',
      description: 'Address ID',
      required: true,
      type: String,
    }),
    ApiResponse({
      status: 200,
      description: 'The found address',
      type: Address,
    }),
    ApiResponse({
      status: 404,
      description: 'Address not found',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
  );
}

export function ApiUpdateAddress() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update an address' }),
    ApiParam({
      name: 'id',
      description: 'Address ID',
      required: true,
      type: String,
    }),
    ApiResponse({
      status: 200,
      description: 'The address has been successfully updated.',
      type: Address,
    }),
    ApiResponse({
      status: 404,
      description: 'Address not found',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
  );
}

export function ApiSetDefaultAddress() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Set an address as default' }),
    ApiParam({
      name: 'id',
      description: 'Address ID',
      required: true,
      type: String,
    }),
    ApiResponse({
      status: 200,
      description: 'The address has been successfully set as default.',
      type: Address,
    }),
    ApiResponse({
      status: 404,
      description: 'Address not found',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
  );
}

export function ApiRemoveAddress() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete an address' }),
    ApiParam({
      name: 'id',
      description: 'Address ID',
      required: true,
      type: String,
    }),
    ApiResponse({
      status: 204,
      description: 'The address has been successfully deleted.',
    }),
    ApiResponse({
      status: 404,
      description: 'Address not found',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
  );
}
