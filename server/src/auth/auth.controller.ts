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
  UseInterceptors,
  ClassSerializerInterceptor,
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
  @Auth(AuthType.NoCookie)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
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
  ) {
    await this.authService.logOut(request, response);
  }

  /*
   * Refresh Token
   */
  @Get('refresh')
  @Auth(AuthType.Cookie)
  public async refreshToken(
    @Req() request: RequestUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.refreshTokens(request, response);
  }
}
