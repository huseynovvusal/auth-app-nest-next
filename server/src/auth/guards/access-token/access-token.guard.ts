import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
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
     * Inject Users Service
     */
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //? Extract Request
    const request = context.switchToHttp().getRequest();

    //? Extract Access Token
    const token = this.extractReuqestFromHeader(request);

    //? Check Access Token
    if (!token) {
      throw new UnauthorizedException();
    }

    //? Verify Access Token
    try {
      const payload = await this.jwtService.verifyAsync<AccessToken>(
        token,
        this.jwtConfiguration,
      );

      //? Find User
      const user = await this.usersService.findOneById(payload.sub);

      if (!user) {
        throw new UnauthorizedException();
      }

      request[REQUEST_USER_KEY] = user;

      //!
      console.log('Access Token Guard -> User:', payload.email);
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractReuqestFromHeader(request: Request) {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];

    return token;
  }
}
