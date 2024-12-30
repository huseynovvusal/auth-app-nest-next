import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sessions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

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
