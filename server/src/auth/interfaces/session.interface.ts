import { User } from 'src/users/entities/user.entity';

export class ISessionPayload {
  user: User;
  userAgent: string;
  ip: string;
}
