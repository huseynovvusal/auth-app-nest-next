import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity()
export class Session {
  @ManyToMany(() => User)
  user: number;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: false,
  })
  userAgent: string;

  @Column({
    type: 'varchar',
    length: 45,
    nullable: false,
  })
  ip: string;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  expiresAt: Date;
}
