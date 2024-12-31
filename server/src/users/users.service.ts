import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { SessionProvider } from 'src/auth/providers/session.provider';
import { GenerateTokensProvider } from 'src/auth/providers/generate-tokens.provider';
import { Response } from 'express';
import { CreateUserProvider } from './providers/create-user.provider';

/*
 * Users Service
 */
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    /*
     * Inject the User Repository
     */
    private readonly createUserProvider: CreateUserProvider,
  ) {}

  /*
   * Create a new user
   */
  public async create(
    createUserDto: CreateUserDto,
    userAgent: string,
    ip: string,
    response: Response,
  ) {
    return this.createUserProvider.create(
      createUserDto,
      userAgent,
      ip,
      response,
    );
  }
}
