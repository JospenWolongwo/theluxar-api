import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

export function ApiCreateReview() {
  return applyDecorators(
    ApiTags('reviews'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create a new review' }),
    ApiResponse({
      status: 201,
      description: 'The review has been successfully created.',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized.',
    }),
  );
}

export function ApiFindAllReviews() {
  return applyDecorators(
    ApiTags('reviews'),
    ApiOperation({ summary: 'Get all reviews' }),
    ApiResponse({
      status: 200,
      description: 'Return all reviews.',
    }),
  );
}

export function ApiFindReviewsByProduct() {
  return applyDecorators(
    ApiTags('reviews'),
    ApiOperation({ summary: 'Get reviews by product ID' }),
    ApiResponse({
      status: 200,
      description: 'Return reviews by product ID.',
    }),
  );
}

export function ApiFindReviewsByStock() {
  return applyDecorators(
    ApiTags('reviews'),
    ApiOperation({ summary: 'Get reviews by stock ID' }),
    ApiResponse({
      status: 200,
      description: 'Return reviews by stock ID.',
    }),
  );
}

export function ApiFindReviewsByUser() {
  return applyDecorators(
    ApiTags('reviews'),
    ApiOperation({ summary: 'Get reviews by user ID' }),
    ApiResponse({
      status: 200,
      description: 'Return reviews by user ID.',
    }),
  );
}

export function ApiFindOneReview() {
  return applyDecorators(
    ApiTags('reviews'),
    ApiOperation({ summary: 'Get a review by id' }),
    ApiResponse({
      status: 200,
      description: 'Return the review.',
    }),
    ApiResponse({
      status: 404,
      description: 'Review not found.',
    }),
  );
}

export function ApiUpdateReview() {
  return applyDecorators(
    ApiTags('reviews'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update a review' }),
    ApiResponse({
      status: 200,
      description: 'The review has been successfully updated.',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized.',
    }),
    ApiResponse({
      status: 404,
      description: 'Review not found.',
    }),
  );
}

export function ApiUpdateReviewHelpfulness() {
  return applyDecorators(
    ApiTags('reviews'),
    ApiOperation({ summary: 'Mark review as helpful or not helpful' }),
    ApiQuery({
      name: 'helpful',
      required: true,
      type: Boolean,
      description: 'True for helpful, false for not helpful',
    }),
    ApiResponse({
      status: 200,
      description: 'The review helpfulness has been updated.',
    }),
    ApiResponse({
      status: 404,
      description: 'Review not found.',
    }),
  );
}

export function ApiRemoveReview() {
  return applyDecorators(
    ApiTags('reviews'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete a review' }),
    ApiResponse({
      status: 200,
      description: 'The review has been successfully deleted.',
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
      description: 'Review not found.',
    }),
  );
}
