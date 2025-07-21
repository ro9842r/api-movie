import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, SignInResponseDto, LogoutResponseDto } from './dto';
import {
  AuthApiTags,
  SignInApiDocs,
  SignUpApiDocs,
  LogoutApiDocs,
} from './decorators';

@Controller('auth')
@AuthApiTags()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @SignInApiDocs()
  async signIn(@Body() user: CreateUserDto): Promise<SignInResponseDto> {
    return await this.authService.signIn(user);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @SignUpApiDocs()
  async signUp(@Body() user: CreateUserDto): Promise<void> {
    await this.authService.signUp(user);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @LogoutApiDocs()
  async logout(): Promise<LogoutResponseDto> {
    return await this.authService.logout();
  }
}
