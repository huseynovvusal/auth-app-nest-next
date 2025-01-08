import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import jwtConfig from '../config/jwt.config';
import { GoogleTokenDto } from './dtos/google-token.dto';
import { UsersService } from 'src/users/users.service';
import { GenerateTokensProvider } from '../providers/generate-tokens.provider';
import { Response } from 'express';
import { SessionProvider } from '../providers/session.provider';
import axios from 'axios';
import { User } from 'src/users/entities/user.entity';

/*
 * Google Authentication Service
 */
@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oAuthClient: OAuth2Client;
  private readonly logger = new Logger(GoogleAuthenticationService.name);

  constructor(
    /*
     * Inject UsersService
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    /*
     * Inject JwtConfiguration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    /*
     * Inject GenerateTokensProvider
     */
    private readonly generateTokensProvider: GenerateTokensProvider,
    /*
     * Inject SessionProvider
     */
    private readonly sessionProvider: SessionProvider,
  ) {}

  onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientSecret = this.jwtConfiguration.googleClientSecret;

    this.oAuthClient = new OAuth2Client(clientId, clientSecret);
  }

  public async authenticate(
    googleTokenDto: GoogleTokenDto,
    userAgent: string,
    ip: string,
    response: Response,
  ): Promise<void> {
    try {
      let user: User | undefined;
      let payload:
        | Pick<TokenPayload, 'sub' | 'given_name' | 'family_name' | 'email'>
        | undefined;

      //? Check if the token is a JWT token
      if (googleTokenDto?.isJwtToken) {
        const googleUserInfo = await axios.get(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${googleTokenDto.token}`,
        );

        const googleUserEmail = googleUserInfo.data.email;

        user = await this.usersService.findOneByEmail(googleUserEmail);

        //TODO: Seperate provider for JWT token which does the same job as ID Token.
      } else {
        //? Verify the Google token
        const ticket = await this.oAuthClient.verifyIdToken({
          idToken: googleTokenDto.token,
        });

        //? Get the payload
        payload = ticket.getPayload();

        // !
        console.log('Google Payload:', {
          email: payload.email,
          googleId: payload.sub,
        });

        //? Find the user by Google ID
        user = await this.usersService.findOneByGoogleId(payload.sub);
      }

      //? If the user exists, generate tokens
      if (user) {
        //? Create a new session
        const session = await this.sessionProvider.create({
          user,
          userAgent,
          ip,
        });

        //? Generate tokens
        // return
        await this.generateTokensProvider.generateTokens(
          user,
          session.id,
          response,
        );
      }

      //? If the user does not exist, create a new user
      const newUser = await this.usersService.createGoogleUser({
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        googleId: payload.sub,
      });

      //? Create a new session
      const newSession = await this.sessionProvider.create({
        user: newUser,
        userAgent,
        ip,
      });

      //? Log the new user
      this.logger.log(
        'New Google user created via Google (OAuth):',
        newUser.email,
      );

      // return;
      await this.generateTokensProvider.generateTokens(
        newUser,
        newSession.id,
        response,
      );
    } catch (error) {
      console.log('Error during Google authentication:', error);
      throw new UnauthorizedException(error);
    }
  }
}
