import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as COOKIE_KEYS from 'src/common/constants/cookie.constants';

@Injectable()
export class NonAcessTokenGuardGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //? Extract Request
    const request = context.switchToHttp().getRequest();

    //? Extract Access Token
    const accessToken = request.cookies?.[COOKIE_KEYS.ACCESS_TOKEN];

    //? Check Access Token
    if (accessToken) {
      throw new ForbiddenException();
    }

    return true;
  }
}
