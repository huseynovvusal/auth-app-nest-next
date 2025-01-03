import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import jwtConfig from 'src/auth/config/jwt.config';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';
import { AccessToken } from 'src/auth/interfaces/accessToken.interface';
import * as COOKIE_KEYS from 'src/common/constants/cookie.constants';

@Injectable()
export class AccessTokenGuard implements CanActivate {
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

    //? Extract Access Token
    const accessToken = request.cookies?.[COOKIE_KEYS.ACCESS_TOKEN];

    //? Check Access Token
    if (!accessToken) {
      throw new UnauthorizedException();
    }

    //? Verify Access Token
    try {
      const payload = await this.jwtService.verifyAsync<AccessToken>(
        accessToken,
        this.jwtConfiguration,
      );

      request[REQUEST_USER_KEY] = payload;

      //!
      console.log('Access Token Guard -> User:', payload.email);
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
