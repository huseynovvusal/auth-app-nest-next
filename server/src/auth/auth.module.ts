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
import { SignInProvider } from './providers/sign-in.provider';
import { User } from 'src/users/entities/user.entity';
import { GoogleAuthenticationController } from './social/google-authentication.controller';
import { GoogleAuthenticationService } from './social/google-authentication.service';
import { LogOutProvider } from './providers/log-out.provider';
import { RefreshTokensProvider } from './providers/refresh-tokens.provider';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    forwardRef(() => UsersModule),
    TypeOrmModule,
    TypeOrmModule.forFeature([Session, VerificationCode, User]),
  ],
  providers: [
    AuthService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    SessionProvider,
    GenerateTokensProvider,
    SignInProvider,
    GoogleAuthenticationService,
    LogOutProvider,
    RefreshTokensProvider,
  ],
  controllers: [AuthController, GoogleAuthenticationController],
  exports: [
    AuthService,
    HashingProvider,
    SessionProvider,
    GenerateTokensProvider,
  ],
})
export class AuthModule {}
