import { Injectable } from '@nestjs/common';
import { SignInProvider } from './providers/sign-in.provider';
import { SignInDto } from './dtos/sign-in.dto';
import { Response } from 'express';
import { LogOutProvider } from './providers/log-out.provider';
import { RequestUser } from './types/requestUser.type';
import { RefreshTokensProvider } from './providers/refresh-tokens.provider';

/*
 * Auth Service
 */
@Injectable()
export class AuthService {
  constructor(
    /*
     * Inject SignInProvider
     */
    private readonly signInProvider: SignInProvider,
    /*
     * Inject LogOutProvider
     */
    private readonly logOutProvider: LogOutProvider,
    /*
     * Inject RefreshTokensProvider
     */
    private readonly refreshTokensProvider: RefreshTokensProvider,
  ) {}

  /*
   * Sign In
   */
  public async signIn(signInDto: SignInDto, userAgent: string, ip: string) {
    return this.signInProvider.signIn(signInDto, userAgent, ip);
  }

  /*
   * Log Out
   */
  public async logOut(request: RequestUser) {
    return await this.logOutProvider.logOut(request);
  }

  /*
   * Refresh Tokens
   */
  public async refreshTokens(request: RequestUser, response: Response) {
    return await this.refreshTokensProvider.refreshTokens(request, response);
  }
}
