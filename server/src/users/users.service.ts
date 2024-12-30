import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async create(
    createUserDto: CreateUserDto,
    userAgent: string,
    ip: string,
  ): Promise<any> {
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

    if (existingUser) {
      throw new BadRequestException(
        'User already exists, please check your email.',
      );
    }

    let newUser = this.userRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });
  }
}
