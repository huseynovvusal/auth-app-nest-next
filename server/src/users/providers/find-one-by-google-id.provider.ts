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
    return await this.userRepository.findOneBy({ googleId });
  }
}
