import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as entities from '../entities';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3305', 10),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'hospital_pro_db',
  entities: Object.values(entities),
  synchronize: true, // auto-create / sync tables in MySQL
  charset: 'utf8mb4_unicode_ci',
  logging: ['error', 'warn'],
};
