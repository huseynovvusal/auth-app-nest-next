import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { SessionProvider } from 'src/auth/providers/session.provider';
import { GenerateTokensProvider } from 'src/auth/providers/generate-tokens.provider';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Response } from 'express';

/*
 * Create User Provider
 */
@Injectable()
export class CreateUserProvider {
  private readonly logger = new Logger(CreateUserProvider.name);

  constructor(
    /*
     * Inject the User Repository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    /*
     * Inject the Hashing Provider
     */
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
    /*
     * Inject the Session Provider
     */
    private readonly sessionProvider: SessionProvider,
    /*
     * Inject the Generate Tokens Provider
     */
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  public async create(
    createUserDto: CreateUserDto,
    userAgent: string,
    ip: string,
    response: Response,
  ): Promise<User> {
    let existingUser = undefined;

    try {
      existingUser = await this.userRepository.findOne({
        where: {
          email: createUserDto.email,
        },
      });
    } catch (error) {
      throw new RequestTimeoutException(error);
    }

    //? Check if user already exists
    if (existingUser) {
      throw new BadRequestException(
        'User already exists, please check your email.',
      );
    }

    //? Create a new user
    let newUser = this.userRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });

    try {
      newUser = await this.userRepository.save(newUser);

      //? Create a new session
      // const session =
      await this.sessionProvider.create({
        userAgent,
        ip,
        user: newUser,
      });
    } catch (error) {
      throw new RequestTimeoutException(error);
    }

    //? Sign Access Token & Refresh Token (Set Cookies)
    // const { accessToken, refreshToken } =
    await this.generateTokensProvider.generateTokens(newUser, response);

    //? Log the new user
    this.logger.log(`New user was created via email: ${newUser.email}`);

    //? Return the new user
    return newUser;
  }
}