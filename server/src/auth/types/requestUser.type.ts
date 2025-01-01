import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';

export type RequestUser = Request & {
  user: Omit<User, 'password' | 'googleId'>;
};
