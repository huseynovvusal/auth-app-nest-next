import { Body, Controller, Ip, Post, Req, Res } from '@nestjs/common';
import { GoogleAuthenticationService } from './google-authentication.service';
import { GoogleTokenDto } from './dtos/google-token.dto';
import { Request, Response, response } from 'express';

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
  public async authenticate(
    @Body() googleTokenDto: GoogleTokenDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Ip() ip: string,
  ) {
    const userAgent = request.headers['user-agent'];

    return await this.googleAuthenticationService.authenticate(
      googleTokenDto,
      userAgent,
      ip,
      response,
    );
  }
}
