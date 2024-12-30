import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { VerificationCodeType } from '../enums/verification-code-type.enum';

@Entity()
export class VerificationCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'integer',
    nullable: false,
  })
  userId: number;

  @Column({
    type: 'enum',
    enum: VerificationCodeType,
    default: VerificationCodeType.EMAIL_VERIFICATION,
  })
  type: VerificationCodeType;

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
