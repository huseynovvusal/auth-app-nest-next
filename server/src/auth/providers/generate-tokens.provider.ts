import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { User } from 'src/users/entities/user.entity';
import { IActiveUser } from '../interfaces/active-user.interface';
import { Response } from 'express';

const NODE_ENV = process.env.NODE_ENV;

@Injectable()
export class GenerateTokensProvider {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private jwtService: JwtService,
  ) {}

  public async signToken<T>(
    userId: number,
    expiresIn: number | string,
    payload?: T,
  ) {
    return await this.jwtService.signAsync(
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

    //? Set HttpOnly Cookies
    response
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: NODE_ENV === 'production',
        expires: new Date(Date.now() + this.jwtConfiguration.accessTokenTtl),
      })
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: NODE_ENV === 'production',
        expires: new Date(Date.now() + this.jwtConfiguration.refreshTokenTtl),
        path: '/auth/refresh',
      });

    return { accessToken, refreshToken };
  }
}
