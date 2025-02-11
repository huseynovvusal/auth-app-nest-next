import {
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
import { SessionProvider } from '../providers/session.provider';
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
  ): Promise<{
    access_token: string;
    refresh_token: string;
    user: User;
    expiresAt: Date;
  }> {
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
        //? Create a new session
        const session = await this.sessionProvider.create({
          user,
          userAgent,
          ip,
        });

        //? Generate tokens
        const { accessToken, refreshToken, expiresAt } =
          await this.generateTokensProvider.generateTokens(user, session.id);

        return {
          access_token: accessToken,
          refresh_token: refreshToken,
          user: user,
          expiresAt,
        };
      }

      //? If the user does not exist, create a new user
      const newUser = await this.usersService.createGoogleUser({
        email,
        firstName,
        lastName,
        googleId,
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

      const { accessToken, refreshToken, expiresAt } =
        await this.generateTokensProvider.generateTokens(
          newUser,
          newSession.id,
        );

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: newUser,
        expiresAt,
      };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
