import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User } from '@src/users/user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  private readonly bcryptSalt: number;

  constructor(
    connection: Connection,
    private readonly configService: ConfigService,
  ) {
    connection.subscribers.push(this);
    this.bcryptSalt = this.configService.get<number>('bcryptSalt');
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  listenTo(): string | Function {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>): Promise<void> {
    const { password } = event.entity;
    event.entity.password = await bcrypt.hash(password, this.bcryptSalt);
  }
}
