import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { GoogleUser } from '../interfaces/google-user.interface';

@Injectable()
export class CreateGoogleUserProvider {
  constructor(
    /*
     * Inject User Repository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async createGoogleUser(googleUser: GoogleUser) {
    try {
      const user = this.userRepository.create({
        ...googleUser,
        //? Set verified to true
        verified: true,
      });

      return await this.userRepository.save(user);
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
