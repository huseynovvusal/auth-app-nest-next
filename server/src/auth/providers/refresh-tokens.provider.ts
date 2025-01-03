import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { RequestUser } from '../types/requestUser.type';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UsersService } from 'src/users/users.service';
import { RefreshToken } from '../interfaces/refreshToken.interface';
import { REQUEST_REFRESH_PAYLOAD_KEY } from '../constants/auth.constants';
import { SessionProvider } from './session.provider';
import * as ERROR_MESSAGES from '../../common/constants/error.contants';

@Injectable()
export class RefreshTokensProvider {
  constructor(
    /*
     * Inject JwtService
     */
    private readonly jwtService: JwtService,
    /*
     * Inject jwtConfiguration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    /*
     * Inject GenerateTokensProvider
     */
    private readonly generateTokensProvider: GenerateTokensProvider,
    /*
     * Inject UsersService
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    /*
     * Inject SessionProvider
     */
    private readonly sessionProvider: SessionProvider,
  ) {}

  public async refreshTokens(request: RequestUser, response: Response) {
    try {
      //? Extract Refresh Token Payload
      const { sessionId, sub }: RefreshToken =
        request[REQUEST_REFRESH_PAYLOAD_KEY];

      // ! Debugging
      console.log('Refresh Token Payload', { sessionId, sub });

      //? Find and check session
      const session = await this.sessionProvider.findOneById(sessionId);

      if (!session || session.expiresAt.getTime() < Date.now()) {
        throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
      }

      //? Update session
      await this.sessionProvider.update(sessionId, {
        ...session,
        expiresAt: new Date(Date.now() + this.jwtConfiguration.sessionTtl),
      });

      //? Find and check user
      const user = await this.usersService.findOneById(sub);

      if (!user) {
        throw new BadRequestException(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      //? Generate new tokens
      await this.generateTokensProvider.generateTokens(
        user,
        sessionId,
        response,
      );
    } catch (error) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }
  }
}
