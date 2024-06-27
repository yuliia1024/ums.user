import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { CreateUserDto } from './dto/create-user.dto';
import { omit } from 'lodash';
import { CreateUserResponseDto } from './dto/create-user.response.dto';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly notificationService: NotificationService
  ) {}

  async create(dto: CreateUserDto): Promise<CreateUserResponseDto> {
    let user: User;

    try {
      user = this.usersRepository.create(dto);

      await this.usersRepository.save(user);

      await this.notificationService.send('user.created', omit(user, 'password'));
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return user
  }
}