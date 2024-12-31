import { Injectable } from '@nestjs/common';
import { SignInProvider } from './providers/sign-in.provider';
import { SignInDto } from './dtos/sign-in.dto';
import { Response } from 'express';

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
}
