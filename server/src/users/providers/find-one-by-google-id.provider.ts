import {
  BadRequestException,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

import * as ERROR_MESSAGES from '../../common/constants/error.contants';

@Injectable()
export class FindOneByGoogleIdProvider {
  constructor(
    /*
     * Inject User Repository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async findOneByGoogleId(googleId: string) {
    let user: User = undefined;

    try {
      user = await this.userRepository.findOneBy({ googleId });
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
