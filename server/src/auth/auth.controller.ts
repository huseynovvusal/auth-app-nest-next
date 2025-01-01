import { Controller, Post, Body, Req, Res, Ip, Get } from '@nestjs/common';
import { SignInDto } from './dtos/sign-in.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { RequestUser } from './types/requestUser.type';

/*
 * Auth Controller
 */
@Controller('auth')
export class AuthController {
  constructor(
    /*
     * Inject AuthService
     */
    private readonly authService: AuthService,
  ) {}

  /*
   * Sign In
   */
  @Post('sign-in')
  public async signIn(
    @Body() signInDto: SignInDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Ip() ip: string,
  ): Promise<any> {
    const userAgent = request.headers['user-agent'];

    return this.authService.signIn(signInDto, userAgent, ip, response);
  }

  /*
   * Log Out
   */
  //TODO: Guards
  @Get('log-out')
  public async logOut(
    @Req() request: RequestUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    this.authService.logOut(request, response);
  }
}
