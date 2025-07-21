import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../dto';

/**
 * Common API error responses decorator
 * Use this for endpoints that can return multiple error types
 */
export const CommonApiResponses = () =>
  applyDecorators(
    ApiBadRequestResponse({
      description: 'Bad Request - Invalid input data',
      type: ErrorResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized - Authentication required',
      type: ErrorResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Forbidden - Insufficient permissions',
      type: ErrorResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Not Found - Resource not found',
      type: ErrorResponseDto,
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
      type: ErrorResponseDto,
    }),
  );
