import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as ERROR_MESSAGES from '../../common/constants/error.contants';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FindOneByIdProvider {
  constructor(
    /*
     * Inject UsersRepository
     */
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async findById(id: number): Promise<User> {
    let user: User | undefined;

    try {
      user = await this.usersRepository.findOneBy({ id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
      );
    }

    if (!user) {
      throw new BadRequestException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return user;
  }
}
