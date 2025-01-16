import { Injectable, RequestTimeoutException, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import * as COOKIE_KEYS from 'src/common/constants/cookie.constants';
import { RequestUser } from '../types/requestUser.type';
import { AccessTokenGuard } from '../guards/access-token/access-token.guard';
import { SessionProvider } from './session.provider';
import { REFRESH_TOKEN_PATH } from '../constants/auth.constants';

/*
 * Log Out Provider
 */
@Injectable()
export class LogOutProvider {
  constructor(
    /*
     * Inject SessionProvider
     */
    private readonly sessionProvider: SessionProvider,
  ) {}

  /*
   * Log Out
   */
  @UseGuards(AccessTokenGuard)
  public async logOut(request: RequestUser): Promise<void> {
    const user = request.user;

    try {
      const session = await this.sessionProvider.delete(user.sessionId);
    } catch (error) {
      throw new RequestTimeoutException(error);
    }

    // !
    console.log('Log Out -> User:', user.email);

    // //? Clear Cookies
    // response
    //   .clearCookie(COOKIE_KEYS.ACCESS_TOKEN)
    //   .clearCookie(COOKIE_KEYS.REFRESH_TOKEN, {
    //     path: REFRESH_TOKEN_PATH,
    //   });
  }
}
