import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { User } from 'src/users/entities/user.entity';
import { IActiveUser } from '../interfaces/active-user.interface';
import { Response } from 'express';

const NODE_ENV = process.env.NODE_ENV;
const IS_PRODUCTION = NODE_ENV === 'production';

@Injectable()
export class GenerateTokensProvider {
  private readonly _defaultCookieOptions = {
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: IS_PRODUCTION,
  };

  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}

  public async signToken<T extends object>(
    userId: number,
    expiresIn: number | string,
    payload?: T,
  ): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  public async generateTokens(
    user: User,
    response: Response,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<IActiveUser>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        {
          email: user.email,
        },
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl),
    ]);

    const accessTokenExpiry = new Date(
      Date.now() + this.jwtConfiguration.accessTokenTtl * 1000,
    );
    const refreshTokenExpiry = new Date(
      Date.now() + this.jwtConfiguration.refreshTokenTtl * 1000,
    );

    response
      .cookie('accessToken', accessToken, {
        ...this._defaultCookieOptions,
        expires: accessTokenExpiry,
      })
      .cookie('refreshToken', refreshToken, {
        ...this._defaultCookieOptions,
        expires: refreshTokenExpiry,
        path: '/auth/refresh',
      });

    return { accessToken, refreshToken };
  }
}
