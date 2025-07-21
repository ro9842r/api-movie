import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  CreateUserDto,
  SignInResponseDto,
  LogoutResponseDto,
  ErrorResponseDto,
} from '../dto';

/**
 * Auth API documentation decorators
 */
export const AuthApiTags = () => ApiTags('Authentication');

export const SignInApiDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'User sign in',
      description: 'Authenticate user with email and password',
    }),
    ApiBody({ type: CreateUserDto }),
    ApiResponse({
      status: 200,
      description: 'User successfully authenticated',
      type: SignInResponseDto,
    }),
    ApiResponse({
      status: 401,
      description: 'Invalid credentials',
      type: ErrorResponseDto,
    }),
  );

export const SignUpApiDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'User registration',
      description: 'Create a new user account',
    }),
    ApiBody({ type: CreateUserDto }),
    ApiResponse({
      status: 201,
      description: 'User successfully created',
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid user data or user already exists',
      type: ErrorResponseDto,
    }),
  );

export const LogoutApiDocs = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'User logout',
      description: 'Sign out the current user session',
    }),
    ApiResponse({
      status: 200,
      description: 'User successfully logged out',
      type: LogoutResponseDto,
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error during logout',
      type: ErrorResponseDto,
    }),
  );
