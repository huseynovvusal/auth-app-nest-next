import { Injectable, RequestTimeoutException, UseGuards } from '@nestjs/common';
import { RequestUser } from '../types/requestUser.type';
import { AccessTokenGuard } from '../guards/access-token/access-token.guard';
import { SessionProvider } from './session.provider';

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
    try {
      await this.sessionProvider.delete(request.accessPayload.sessionId);
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException(error);
    }

    // !
    console.log(
      `Log Out -> User (${request.user.firstName}):`,
      request.user.email,
    );

    // //? Clear Cookies
    // response
    //   .clearCookie(COOKIE_KEYS.ACCESS_TOKEN)
    //   .clearCookie(COOKIE_KEYS.REFRESH_TOKEN, {
    //     path: REFRESH_TOKEN_PATH,
    //   });
  }
}
