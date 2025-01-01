import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindOneByGoogleIdProvider } from './providers/find-one-by-google-id.provider';
import { CreateGoogleUserProvider } from './providers/create-google-user.provider';
import jwtConfig from 'src/auth/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { FindOneByEmailProvider } from './providers/find-one-by-email.provider';
import { FindOneByIdProvider } from './providers/find-one-by-id.provider';

@Module({
  imports: [
    TypeOrmModule,
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  providers: [
    UsersService,
    CreateUserProvider,
    FindOneByGoogleIdProvider,
    CreateGoogleUserProvider,
    FindOneByEmailProvider,
    FindOneByIdProvider,
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
