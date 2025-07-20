import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SupabaseService } from './supabase/supabase.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly supabase: SupabaseService) {}

  async signIn({ email, password }: CreateUserDto): Promise<{
    access_token: string;
  }> {
    const {
      data: { session },
      error,
    } = await this.supabase.getClient().auth.signInWithPassword({
      email,
      password,
    });

    if (error || !session) {
      throw new HttpException(
        'Invalid credentials or session not found',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return {
      access_token: session.access_token,
    };
  }

  async signUp({ email, password }: CreateUserDto): Promise<void> {
    const { data, error } = await this.supabase.getClient().auth.signUp({
      email,
      password,
    });

    if (error || !data.user) {
      throw new HttpException(
        error?.message || 'Error creating user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async logout(): Promise<{ message: string }> {
    const { error } = await this.supabase.getClient().auth.signOut();

    if (error) {
      throw new HttpException(
        'Error during logout',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { message: 'Logout successful' };
  }
}
