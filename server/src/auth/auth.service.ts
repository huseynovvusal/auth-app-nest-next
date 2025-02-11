import { Injectable } from '@nestjs/common';
import { SignInProvider } from './providers/sign-in.provider';
import { SignInDto } from './dtos/sign-in.dto';
import { Response } from 'express';
import { LogOutProvider } from './providers/log-out.provider';
import { RequestUser } from './types/requestUser.type';
import { RefreshTokensProvider } from './providers/refresh-tokens.provider';
import RefreshTokenDto from './dtos/refresh-token.dto';
import { SessionProvider } from './providers/session.provider';

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
    /*
     * Inject Session Provider
     */
    private readonly sessionProvider: SessionProvider,
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
  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    return await this.refreshTokensProvider.refreshTokens(refreshTokenDto);
  }

  /*
   * Get User Sessions
   */
  public async getUserSessions(request: RequestUser) {
    return await this.sessionProvider.findAllByUserId(request.user.id);
  }
}
