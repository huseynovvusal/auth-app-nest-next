import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/sign-in.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from './hashing.provider';
import * as ERROR_MESSAGES from '../../common/constants/error.contants';
import { SessionProvider } from './session.provider';
import { Response } from 'express';
import { GenerateTokensProvider } from './generate-tokens.provider';

/*
 * Sign In Provider
 */
@Injectable()
export class SignInProvider {
  constructor(
    /*
     * Inject User Repository
     */
    @InjectRepository(User)
    private readonly userReposiotry: Repository<User>,
    /*
     * Inject Session Provider
     */
    private readonly sessionProvider: SessionProvider,
    /*
     * Inject Hashing Provider
     */
    private readonly hashingProvider: HashingProvider,
    /*
     * Inject Generate Tokens Provider
     */
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  public async signIn(
    signInDto: SignInDto,
    userAgent: string,
    ip: string,
  ): Promise<{
    access_token: string;
    refresh_token: string;
    user: User;
    expiresAt: Date;
  }> {
    let user: User;

    //? Find user by email
    try {
      user = await this.userReposiotry.findOne({
        where: {
          email: signInDto.email,
        },
      });
    } catch (error) {
      throw new RequestTimeoutException(error);
    }

    //? Check if user exists
    if (!user) {
      throw new UnauthorizedException(
        ERROR_MESSAGES.EMAIL_OR_PASSWORD_NOT_CORRECT,
      );
    }

    //? Check if password is valid
    const isPasswordValid = await this.hashingProvider.comparePassword(
      signInDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        ERROR_MESSAGES.EMAIL_OR_PASSWORD_NOT_CORRECT,
      );
    }

    //? Create a new session
    const session = await this.sessionProvider.create({
      user,
      userAgent,
      ip,
    });

    //? Sign Access Token & Refresh Token (Set Cookies)
    // const { accessToken, refreshToken } =
    const { accessToken, refreshToken, expiresAt } =
      await this.generateTokensProvider.generateTokens(user, session.id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: user,
      expiresAt,
    };
  }
}
