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
import * as AUTH_ERROR_MESSAGES from '../../common/constants/error.contants';
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
    response: Response,
  ): Promise<User> {
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
        AUTH_ERROR_MESSAGES.EMAIL_OR_PASSWORD_NOT_CORRECT,
      );
    }

    //? Check if password is valid
    const isPasswordValid = await this.hashingProvider.comparePassword(
      signInDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        AUTH_ERROR_MESSAGES.EMAIL_OR_PASSWORD_NOT_CORRECT,
      );
    }

    //? Create a new session
    const session = this.sessionProvider.create({
      user,
      userAgent,
      ip,
    });

    //? Sign Access Token & Refresh Token (Set Cookies)
    // const { accessToken, refreshToken } =
    await this.generateTokensProvider.generateTokens(user, response);

    return user;
  }
}
