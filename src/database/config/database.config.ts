import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

dotenvExpand.expand(config());

export const typeormOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  autoLoadEntities: true,
  synchronize: false,
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  entities: ['**/*.entity.ts'],
} as const satisfies TypeOrmModuleOptions;

export default registerAs('database', () => typeormOptions);
