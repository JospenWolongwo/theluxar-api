import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { Order } from '../entities/order.entity';
import { OrderStatus } from '../enums/order-status.enum';

export function ApiCreateOrder() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create a new order' }),
    ApiResponse({
      status: 201,
      description: 'The order has been successfully created.',
      type: Order,
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

export function ApiFindAllOrders() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get all orders' }),
    ApiResponse({
      status: 200,
      description: 'List of all orders',
      type: [Order],
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

export function ApiFindOrdersByUser() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get orders for current user' }),
    ApiResponse({
      status: 200,
      description: 'Orders for the current authenticated user',
      type: [Order],
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
  );
}

export function ApiFindOneOrder() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get an order by ID' }),
    ApiParam({
      name: 'id',
      description: 'Order ID',
      required: true,
      type: String,
    }),
    ApiResponse({
      status: 200,
      description: 'The found order',
      type: Order,
    }),
    ApiResponse({
      status: 404,
      description: 'Order not found',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
  );
}

export function ApiFindOrderByNumber() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get an order by order number' }),
    ApiParam({
      name: 'orderNumber',
      description: 'Order Number',
      required: true,
      type: String,
    }),
    ApiResponse({
      status: 200,
      description: 'The found order',
      type: Order,
    }),
    ApiResponse({
      status: 404,
      description: 'Order not found',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
  );
}

export function ApiUpdateOrder() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update an order' }),
    ApiParam({
      name: 'id',
      description: 'Order ID',
      required: true,
      type: String,
    }),
    ApiResponse({
      status: 200,
      description: 'The order has been successfully updated.',
      type: Order,
    }),
    ApiResponse({
      status: 404,
      description: 'Order not found',
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

export function ApiUpdateOrderStatus() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update order status' }),
    ApiParam({
      name: 'id',
      description: 'Order ID',
      required: true,
      type: String,
    }),
    ApiQuery({
      name: 'status',
      description: 'New status for the order',
      required: true,
      enum: OrderStatus,
    }),
    ApiResponse({
      status: 200,
      description: 'The order status has been successfully updated.',
      type: Order,
    }),
    ApiResponse({
      status: 404,
      description: 'Order not found',
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

export function ApiRemoveOrder() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete an order' }),
    ApiParam({
      name: 'id',
      description: 'Order ID',
      required: true,
      type: String,
    }),
    ApiResponse({
      status: 204,
      description: 'The order has been successfully deleted.',
    }),
    ApiResponse({
      status: 404,
      description: 'Order not found',
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
