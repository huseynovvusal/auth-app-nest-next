import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import * as ERROR_MESSAGES from '../../common/constants/error.contants';

@Injectable()
export class FindOneByEmailProvider {
  constructor(
    /*
     * Inject UserRepository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async findOneByEmail(email: string): Promise<User> {
    let user: User | undefined;

    try {
      user = await this.userRepository.findOneBy({ email });
    } catch (error) {
      throw new RequestTimeoutException(
        ERROR_MESSAGES.UNABLE_TO_PROCESS_REQUEST,
      );
    }

    if (!user) {
      throw new BadRequestException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return user;
  }
}
