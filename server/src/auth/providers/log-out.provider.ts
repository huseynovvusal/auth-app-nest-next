import { Injectable, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import * as COOKIE_KEYS from 'src/common/constants/cookie.constants';
import { RequestUser } from '../types/requestUser.type';
import { AccessTokenGuard } from '../guards/access-token/access-token.guard';

/*
 * Log Out Provider
 */
@Injectable()
export class LogOutProvider {
  constructor() {}

  /*
   * Log Out
   */
  @UseGuards(AccessTokenGuard)
  public async logOut(request: RequestUser, response: Response): Promise<void> {
    //TODO: Implement Session Management
    const user = request.user;

    // !
    console.log('User:', user);

    //? Clear Cookies
    response.clearCookie(COOKIE_KEYS.ACCESS_TOKEN);
    // response.clearCookie(COOKIE_KEYS.REFRESH_TOKEN);
  }
}
