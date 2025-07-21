# Auth Module Documentation

## Overview

The Auth module provides authentication functionality with comprehensive Swagger documentation using custom decorators to keep the code clean and maintainable.

## API Endpoints

### Authentication Routes

- `POST /auth/login` - User sign in
- `POST /auth/signup` - User registration
- `POST /auth/logout` - User logout

## Custom Decorators

### `@AuthApiTags()`

Applies the "Authentication" tag to controllers for Swagger grouping.

### `@SignInApiDocs()`

Complete documentation for sign-in endpoint including:

- Request body schema
- Success response (200) with JWT token
- Error response (401) for invalid credentials

### `@SignUpApiDocs()`

Complete documentation for sign-up endpoint including:

- Request body schema
- Success response (201)
- Error response (400) for validation errors

### `@LogoutApiDocs()`

Complete documentation for logout endpoint including:

- Bearer token requirement
- Success response (200)
- Error response (500) for server errors

### `@AuthRequired()`

General decorator for protected routes that adds:

- Bearer token authentication requirement
- Unauthorized response documentation

## Usage Examples

### Basic Auth Controller

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { AuthApiTags, SignInApiDocs } from './decorators';

@Controller('auth')
@AuthApiTags()
export class AuthController {
  @Post('login')
  @SignInApiDocs()
  async signIn(@Body() user: CreateUserDto) {
    // Implementation
  }
}
```

### Protected Routes

```typescript
import { Controller, Get } from '@nestjs/common';
import { AuthRequired } from '../../auth/decorators';

@Controller('protected')
@AuthRequired()
export class ProtectedController {
  @Get()
  async getProtectedData() {
    // Protected route implementation
  }
}
```

## DTOs

### `CreateUserDto`

- `email`: User email (validated format)
- `password`: User password (minimum 6 characters)

### `SignInResponseDto`

- `access_token`: JWT token for authentication

### `LogoutResponseDto`

- `message`: Confirmation message

### `ErrorResponseDto`

- `statusCode`: HTTP status code
- `message`: Error description

## Benefits

1. **Clean Code**: Controllers remain focused on business logic
2. **Consistency**: Standardized documentation across all auth endpoints
3. **Reusability**: Decorators can be applied to any auth-related endpoint
4. **Maintainability**: Documentation changes in one place affect all usages
5. **Type Safety**: DTOs provide compile-time type checking
