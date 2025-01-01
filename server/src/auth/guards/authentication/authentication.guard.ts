import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defautAuthType = AuthType.Cookie;

  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  > = {
    [AuthType.Cookie]: this.accessTokenGuard,
    [AuthType.None]: { canActivate: () => true },
  };

  constructor(
    /*
     * Inject Reflector
     */
    private readonly refletctor: Reflector,
    /*
     * Inject AccessTokenGuard
     */
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //? Extract Auth Types
    const authTypes = this.refletctor.getAllAndOverride(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [AuthenticationGuard.defautAuthType];

    // !
    // console.log('Auth Types:', authTypes);

    //? Extract Guards
    const guards: CanActivate[] = authTypes.map(
      (type: AuthType) => this.authTypeGuardMap[type],
    );

    // !
    // console.log('Guards:', guards);

    const error = new UnauthorizedException();

    for (const instance of guards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(context),
      ).catch((error) => ({ error }));

      // !
      // console.log('Can Activate:', canActivate);

      if (canActivate === true) return true;
    }

    throw error;
  }
}
