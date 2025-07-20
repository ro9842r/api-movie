import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

dotenvExpand.expand(config({ path: '.env' }));

export const typeormOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  autoLoadEntities: true,
  synchronize: false,
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
} as const satisfies TypeOrmModuleOptions;

export default registerAs('database', () => typeormOptions);
