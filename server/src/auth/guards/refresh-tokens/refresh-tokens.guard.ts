import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import jwtConfig from 'src/auth/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import * as COOKIE_KEYS from '../../../common/constants/cookie.constants';
import * as ERROR_MESSAGES from '../../../common/constants/error.contants';

import { RefreshToken } from 'src/auth/interfaces/refreshToken.interface';
import { REQUEST_REFRESH_PAYLOAD_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class RefreshTokensGuard implements CanActivate {
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
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //? Extract Request
    const request = context.switchToHttp().getRequest();

    //? Extract Refresh Token
    const refreshToken = request.cookies?.[COOKIE_KEYS.REFRESH_TOKEN];

    //? Check Refresh Token
    if (!refreshToken) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }

    try {
      //? Verify Refresh Token
      const payload = await this.jwtService.verifyAsync<RefreshToken>(
        refreshToken,
        this.jwtConfiguration,
      );

      request[REQUEST_REFRESH_PAYLOAD_KEY] = payload;

      //!
      console.log('Refresh Token Guard -> User:', payload.sub);
    } catch (error) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }

    return true;
  }
}
