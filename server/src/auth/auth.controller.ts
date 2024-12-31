import { Controller, Post, Body, Req, Res, Ip } from '@nestjs/common';
import { SignInDto } from './dtos/sign-in.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

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
}
