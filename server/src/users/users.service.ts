import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { Response } from 'express';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindOneByGoogleIdProvider } from './providers/find-one-by-google-id.provider';
import { CreateGoogleUserProvider } from './providers/create-google-user.provider';
import { GoogleUser } from './interfaces/google-user.interface';
import { FindOneByEmailProvider } from './providers/find-one-by-email.provider';
import { FindOneByIdProvider } from './providers/find-one-by-id.provider';

/*
 * Users Service
 */
@Injectable()
export class UsersService {
  constructor(
    /*
     * Inject User Repository
     */
    private readonly createUserProvider: CreateUserProvider,
    /*
     * Inject Find One By Google Id Provider
     */
    private readonly findOneByGoogleIdProvider: FindOneByGoogleIdProvider,
    /*
     * Inject Find One By Email Provider
     */
    private readonly findOneByEmailProvider: FindOneByEmailProvider,
    /*
     * Inject FindOneByIdProvider
     */
    private readonly findOneByIdProvider: FindOneByIdProvider,
    /*
     * Inject Create Google User Provider
     */
    private readonly createGoogleUserProvider: CreateGoogleUserProvider,
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
    return await this.createUserProvider.create(
      createUserDto,
      userAgent,
      ip,
      response,
    );
  }

  /*
   * Find one user by google id
   */
  public async findOneByGoogleId(googleId: string) {
    return await this.findOneByGoogleIdProvider.findOneByGoogleId(googleId);
  }

  /*
   * Create a new google user
   */
  public async createGoogleUser(googleUser: GoogleUser) {
    return await this.createGoogleUserProvider.createGoogleUser(googleUser);
  }

  /*
   * Find one user by email
   */
  public async findOneByEmail(email: string) {
    return await this.findOneByEmailProvider.findOneByEmail(email);
  }

  /*
   * Find one user by id
   */
  public async findOneById(id: number) {
    return await this.findOneByIdProvider.findById(id);
  }
}
