import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

export function ApiSignup() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({ summary: 'User signup' }),
    ApiResponse({
      status: 201,
      description: 'User successfully signed up',
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request. Validation failed.',
    }),
  );
}

export function ApiLogin() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({ summary: 'User login' }),
    ApiResponse({
      status: 200,
      description: 'User successfully logged in',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized. Invalid credentials.',
    }),
  );
}
