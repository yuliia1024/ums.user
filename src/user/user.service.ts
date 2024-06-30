import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from './user.entity';
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
    private readonly notificationService: NotificationService,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateUserDto): Promise<CreateUserResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let user: User;

    try {
      user = this.usersRepository.create(dto);

      await queryRunner.manager.save(user);

      await this.notificationService.send('user.created', omit(user, 'password'));

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error creating user:', err);
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }

    // @ts-ignore
    return omit(user, 'password');
  }
}
