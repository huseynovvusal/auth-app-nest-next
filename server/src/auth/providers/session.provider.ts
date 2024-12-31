import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Session } from '../entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { ISessionPayload } from '../interfaces/session.interface';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';

@Injectable()
export class SessionProvider {
  constructor(
    /*
     * Inject the repository for the Session entity
     */
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    /*
     * Inject the JWT configuration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  public async create(sessionPayload: ISessionPayload): Promise<Session> {
    const session = this.sessionRepository.create({
      ...sessionPayload,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + this.jwtConfiguration.sessionTtl),
    });

    return this.sessionRepository.save(session);
  }
}
