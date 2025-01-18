import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';

export type RequestUser = Request & {
  user: User;
  payload: {
    sub: number;
    sessionId: number;
    email: string;
  };
};
