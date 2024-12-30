import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashingProvider } from './providers/hashing.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { VerificationCode } from './entities/verification-code.entity';
import { SessionProvider } from './providers/session.provider';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { GenerateTokensProvider } from './providers/generate-tokens.provider';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    forwardRef(() => UsersModule),
    TypeOrmModule,
    TypeOrmModule.forFeature([Session, VerificationCode]),
  ],
  providers: [
    AuthService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    SessionProvider,
    GenerateTokensProvider,
  ],
  controllers: [AuthController],
  exports: [
    AuthService,
    HashingProvider,
    SessionProvider,
    GenerateTokensProvider,
  ],
})
export class AuthModule {}
