import { Injectable } from '@nestjs/common';
import { SignInProvider } from './providers/sign-in.provider';
import { SignInDto } from './dtos/sign-in.dto';
import { Response } from 'express';
import { LogOutProvider } from './providers/log-out.provider';
import { RequestUser } from './types/requestUser.type';

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
  ) {}

  /*
   * Sign In
   */
  public async signIn(
    signInDto: SignInDto,
    userAgent: string,
    ip: string,
    response: Response,
  ) {
    return this.signInProvider.signIn(signInDto, userAgent, ip, response);
  }

  /*
   * Log Out
   */
  public async logOut(request: RequestUser, response: Response) {
    return await this.logOutProvider.logOut(request, response);
  }
}
