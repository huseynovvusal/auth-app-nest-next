import { Body, Controller, Ip, Post, Req, Res } from '@nestjs/common';
import { GoogleAuthenticationService } from './google-authentication.service';
import { GoogleTokenDto } from './dtos/google-token.dto';
import { Request, Response } from 'express';
import { Auth } from '../decorators/auth.decorator';
import { AuthType } from '../enums/auth-type.enum';

//TODO: Auth Guard
@Controller('auth/google-authentication')
export class GoogleAuthenticationController {
  constructor(
    /*
     * Inject Google Authentication Service
     */
    private readonly googleAuthenticationService: GoogleAuthenticationService,
  ) {}

  @Post()
  @Auth(AuthType.None)
  public async authenticate(
    @Body() googleTokenDto: GoogleTokenDto,
    @Req() request: Request,
    @Ip() ip: string,
  ): Promise<void> {
    const userAgent = request.headers['user-agent'];

    // return
    await this.googleAuthenticationService.authenticate(
      googleTokenDto,
      userAgent,
      ip,
    );
  }
}
