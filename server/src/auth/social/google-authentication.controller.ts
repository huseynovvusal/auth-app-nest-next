import { Body, Controller, Post, Res } from '@nestjs/common';
import { GoogleAuthenticationService } from './google-authentication.service';
import { GoogleTokenDto } from './dtos/google-token.dto';
import { Response, response } from 'express';

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
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.googleAuthenticationService.authenticate(
      googleTokenDto,
      response,
    );
  }
}
