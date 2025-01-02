import { Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { Session } from '../entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { ISessionPayload } from '../interfaces/session.interface';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { merge } from 'rxjs';

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

  public async findOneById(sessionId: number): Promise<Session> {
    let session: Session = undefined;

    try {
      session = await this.sessionRepository.findOneBy({ id: sessionId });
    } catch (error) {
      throw new RequestTimeoutException(error);
    }

    if (!session) {
      throw new RequestTimeoutException(`Session not found`);
    }

    return session;
  }

  public async create(sessionPayload: ISessionPayload): Promise<Session> {
    const session = this.sessionRepository.create({
      ...sessionPayload,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + this.jwtConfiguration.sessionTtl),
    });

    return this.sessionRepository.save(session);
  }

  public async delete(sessionId: number): Promise<void> {
    await this.sessionRepository.delete(sessionId);
  }

  public async update(
    sessionId: number,
    newSessionData: Partial<Session>,
  ): Promise<void> {
    try {
      await this.sessionRepository.update({ id: sessionId }, newSessionData);
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
  }
}
