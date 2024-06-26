import { Entity, Column, PrimaryColumn, Generated } from 'typeorm';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
 static passwordMinLength: number = 7;

  @PrimaryColumn({ type:"uuid" })
  @Generated("uuid")
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @IsEmail()
  @Column({ unique: true })
  email: string;

  @IsString()
  @MinLength(User.passwordMinLength)
  @Exclude({ toPlainOnly: true })
  @Column({ select: false })
  password: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
  createdAt: string;
}