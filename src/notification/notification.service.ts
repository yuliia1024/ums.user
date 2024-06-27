import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private readonly amqpConnection: AmqpConnection
  ) {}

  async send(routingKey: string, data: any): Promise<void> {
    try {
      const notification = await this.notificationRepository.create({
        type: routingKey,
        data,
      });
      await this.notificationRepository.save(notification);

      await this.amqpConnection.publish('user.exchange', routingKey, { eventId: notification.id, data });

      this.logger.log(`Published ${routingKey} event:`, { eventId: notification.id, data });

    } catch (err) {
      this.logger.log(`Error in publishing ${routingKey} event`, err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}