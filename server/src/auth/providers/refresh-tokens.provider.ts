import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { RequestUser } from '../types/requestUser.type';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UsersService } from 'src/users/users.service';
import { RefreshToken } from '../interfaces/refreshToken.interface';

@Injectable()
export class RefreshTokensProvider {
  constructor(
    /*
     * Inject JwtService
     */
    private readonly jwtService: JwtService,
    /*
     * Inject jwtConfiguration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    /*
     * Inject GenerateTokensProvider
     */
    private readonly generateTokensProvider: GenerateTokensProvider,
    /*
     * Inject UsersService
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  public async refreshTokens(request: RequestUser, response: Response) {
    try {
      const refreshToken = request.cookies['refresh-token'];

      const { sub } = await this.jwtService.verifyAsync<RefreshToken>(
        refreshToken,
        this.jwtConfiguration,
      );

      //TODO:   const user = this.usersService.find
    } catch (error) {}
  }
}
