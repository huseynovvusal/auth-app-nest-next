import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';
import { REQUEST_ACCESS_PAYLOAD_KEY } from '../constants/auth.constants';

export type RequestUser = Request & {
  user: User;
  [REQUEST_ACCESS_PAYLOAD_KEY]: {
    sub: number;
    sessionId: number;
    email: string;
  };
};
