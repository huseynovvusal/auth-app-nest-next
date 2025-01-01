import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Ip,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SignInDto } from './dtos/sign-in.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { RequestUser } from './types/requestUser.type';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';

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
  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
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
  @Get('log-out')
  // @Auth(AuthType.Cookie)
  public async logOut(
    @Req() request: RequestUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    this.authService.logOut(request, response);
  }
}
