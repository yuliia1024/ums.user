import { Entity, Column, PrimaryColumn, Generated } from 'typeorm';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Exclude } from 'class-transformer';

export class CreateUserResponseDto {

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  createdAt: string;

}