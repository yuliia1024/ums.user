import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Notification } from '../notification/notification.entity';
import { NotificationService } from '../notification/notification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Notification]),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        exchanges: [
          {
            name: 'user.exchange',
            type: 'topic',
          },
        ],
        uri: configService.get<string>('RABBITMQ_URI'),
        connectionInitOptions: { wait: false },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UserService, NotificationService],
  controllers: [UserController],
})
export class UserModule {}