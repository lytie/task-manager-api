import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('database.host'),
        port: config.get<number>('database.port'),
        username: config.get('database.username'),
        password: config.get('database.password'),
        database: config.get('database.name'),
        entities: [join(__dirname, '..', '..', '**', '*.entity.{js,ts}')],
        subscribers: [
          join(__dirname, '..', '..', '**', '*.subscriber.{js,ts}'),
        ],
        synchronize: process.env.NODE_ENV === 'production' ? false : true, // Tránh dùng trên production có thể gây mất dữ liệu
        logging: process.env.NODE_ENV === 'production' ? false : true,
      }),
    }),
  ],
})
export class DatabaseModule {}
