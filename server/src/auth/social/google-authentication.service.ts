import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from '../config/jwt.config';
import { GoogleTokenDto } from './dtos/google-token.dto';
import { UsersService } from 'src/users/users.service';
import { GenerateTokensProvider } from '../providers/generate-tokens.provider';
import { Response } from 'express';

/*
 * Google Authentication Service
 */
@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oAuthClient: OAuth2Client;
  private readonly logger = new Logger(GoogleAuthenticationService.name);

  constructor(
    /*
     * Inject Users Service
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    /*
     * Inject JWT Configuration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    /*
     * Inject Generate Tokens Provider
     */
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientSecret = this.jwtConfiguration.googleClientSecret;

    this.oAuthClient = new OAuth2Client(clientId, clientSecret);
  }

  public async authenticate(
    googleTokenDto: GoogleTokenDto,
    response: Response,
  ) {
    try {
      //? Verify the Google token
      const ticket = await this.oAuthClient.verifyIdToken({
        idToken: googleTokenDto.token,
      });

      //? Get the payload
      const {
        email,
        sub: googleId,
        given_name: firstName,
        family_name: lastName,
      } = ticket.getPayload();

      // !
      console.log('Google Payload:', { email, googleId });

      //? Find the user by Google ID
      const user = await this.usersService.findOneByGoogleId(googleId);

      //? If the user exists, generate tokens
      if (user) {
        return await this.generateTokensProvider.generateTokens(user, response);
      }

      //? If the user does not exist, create a new user

      const newUser = await this.usersService.createGoogleUser({
        email,
        firstName,
        lastName,
        googleId,
      });

      //? Log the new user
      this.logger.log(
        'New Google user created via Google (OAuth):',
        newUser.email,
      );

      return await this.generateTokensProvider.generateTokens(
        newUser,
        response,
      );
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
