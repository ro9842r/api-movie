import { applyDecorators } from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';

/**
 * Pagination documentation decorator
 * Use for endpoints that support pagination
 */
export const PaginatedApiDocs = (responseType: any) =>
  applyDecorators(
    ApiQuery({
      name: 'page',
      description: 'Page number for pagination',
      example: 1,
      required: false,
    }),
    ApiResponse({
      status: 200,
      description: 'Paginated results retrieved successfully',
      type: responseType,
    }),
  );
