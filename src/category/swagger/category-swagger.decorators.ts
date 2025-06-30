import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

export function ApiCreateCategory() {
  return applyDecorators(
    ApiTags('categories'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create a new category' }),
    ApiResponse({ status: 201, description: 'The category has been successfully created.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
  );
}

export function ApiFindAllCategories() {
  return applyDecorators(
    ApiTags('categories'),
    ApiOperation({ summary: 'Get all categories' }),
    ApiResponse({ status: 200, description: 'Return all categories.' }),
  );
}

export function ApiFindRootCategories() {
  return applyDecorators(
    ApiTags('categories'),
    ApiOperation({ summary: 'Get root categories (with no parent)' }),
    ApiResponse({ status: 200, description: 'Return root categories.' }),
  );
}

export function ApiFindOneCategory() {
  return applyDecorators(
    ApiTags('categories'),
    ApiOperation({ summary: 'Get a category by id' }),
    ApiResponse({ status: 200, description: 'Return the category.' }),
    ApiResponse({ status: 404, description: 'Category not found.' }),
  );
}

export function ApiGetCategoryChildren() {
  return applyDecorators(
    ApiTags('categories'),
    ApiOperation({ summary: 'Get child categories for a specific category' }),
    ApiResponse({ status: 200, description: 'Return child categories.' }),
    ApiResponse({ status: 404, description: 'Category not found.' }),
  );
}

export function ApiFindCategoriesByParent() {
  return applyDecorators(
    ApiTags('categories'),
    ApiOperation({ summary: 'Get categories by parent ID' }),
    ApiResponse({
      status: 200,
      description: 'Return categories by parent ID.',
    }),
  );
}

export function ApiUpdateCategory() {
  return applyDecorators(
    ApiTags('categories'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update a category' }),
    ApiResponse({ status: 200, description: 'The category has been successfully updated.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Category not found.' }),
  );
}

export function ApiRemoveCategory() {
  return applyDecorators(
    ApiTags('categories'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete a category' }),
    ApiResponse({ status: 200, description: 'The category has been successfully deleted.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Category not found.' }),
  );
}
