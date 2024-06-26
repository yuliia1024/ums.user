import { Entity, Column, PrimaryColumn, Generated } from 'typeorm';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Exclude } from 'class-transformer';

export class CreateUserDto {
 static passwordMinLength: number = 7;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @MinLength(CreateUserDto.passwordMinLength)
  password: string;

}