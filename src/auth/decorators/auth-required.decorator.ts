import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ErrorResponseDto } from '../dto';

/**
 * Decorator for routes that require authentication
 * Adds Bearer Auth requirement and unauthorized response documentation
 */
export const AuthRequired = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: 'Unauthorized - Valid JWT token required',
      type: ErrorResponseDto,
    }),
  );
