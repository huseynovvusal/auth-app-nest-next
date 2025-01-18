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
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import RefreshTokenDto from './dtos/refresh-token.dto';

/*
 * Auth Controller
 */
@Controller('auth')
export class AuthController {
  constructor(
    /*
     * Inject Auth Service
     */
    private readonly authService: AuthService,
    /*
     * Inject Users Service
     */
    private readonly usersService: UsersService,
  ) {}
  /*
   * Register
   */
  @Post('register')
  // Restrict access to this route to logged-in users
  @Auth(AuthType.None)
  @UseInterceptors(ClassSerializerInterceptor)
  public async create(
    @Body() createUserDto: CreateUserDto,
    @Req() request: Request,
    @Ip() ip: string,
  ) {
    const userAgent = request.headers['user-agent'];

    return this.usersService.create(createUserDto, userAgent, ip);
  }
  /*
   * Sign In
   */
  @Post('sign-in')
  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  public async signIn(
    @Body() signInDto: SignInDto,
    @Req() request: Request,
    @Ip() ip: string,
  ) {
    const userAgent = request.headers['user-agent'];

    return this.authService.signIn(signInDto, userAgent, ip);
  }

  /*
   * Log Out
   */
  @Get('log-out')
  // @Auth(AuthType.Cookie)
  public async logOut(@Req() request: RequestUser) {
    await this.authService.logOut(request);
  }

  /*
   * Refresh Token
   */
  @Post('refresh')
  @Auth(AuthType.None)
  public async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refreshTokens(refreshTokenDto);
  }

  /*
   * Get User Sessions
   */
  @Get('sessions')
  @Auth(AuthType.Bearer)
  public async getUserSessions(@Req() request: RequestUser) {
    return await this.authService.getUserSessions(request);
  }
}
