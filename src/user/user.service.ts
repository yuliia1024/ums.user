import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { CreateUserDto } from './dto/create-user.dto';
import { omit } from 'lodash';
import { CreateUserResponseDto } from './dto/create-user.response.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly amqpConnection: AmqpConnection
  ) {}

  async create(dto: CreateUserDto): Promise<CreateUserResponseDto> {
    const user = this.usersRepository.create(dto);

    await this.usersRepository.save(user);

    await this.amqpConnection.publish('user.exchange', 'user.created', { ...omit(user, 'password') });

    this.logger.log(`Published user.created event for userId: ${user.id}`);

    return omit(user, 'password');
  }

  async getAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
}