import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SupabaseService } from './supabase/supabase.service';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService, JwtStrategy, SupabaseService],
  controllers: [AuthController],
})
export class AuthModule {}
