// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CigarModule } from './cigars/cigar.module';
import { Cigar } from './cigars/entities/cigar.entity';
import { Brand } from './brands/entities/brand.entity';
import { Vitola } from './vitolas/entities/vitola.entity';
import { Collection } from './collections/entities/collection.entity';
import { User } from './users/entities/user.entity';
import { BrandModule } from './brands/brand.module';
import { VitolaModule } from './vitolas/vitola.module';
import { CollectionsModule } from './collections/collections.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Cigar, Brand, Vitola, Collection, User],
        synchronize: configService.get('NODE_ENV') === 'development', // Auto-create tables in dev
      }),
      inject: [ConfigService],
    }),
    BrandModule,
    CigarModule,
    VitolaModule,
    CollectionsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
