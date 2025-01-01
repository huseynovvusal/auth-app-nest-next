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
import { UsersService } from 'src/users/users.service';

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
    /*
     * Inject UsersService
     */
    private readonly usersService: UsersService,
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

      //? Find User
      const user = await this.usersService.findOneByEmail(payload.email);

      //? Attach User to Request
      request[REQUEST_USER_KEY] = user;

      //! LOG
      console.log('Access Token Guard -> User:', user.email);
      // console.log('Access Token Guard -> Payload:', payload);
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
