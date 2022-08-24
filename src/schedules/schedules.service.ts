import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerService } from '@src/logger/custom.logger';

@Injectable()
export class SchedulesService {
  constructor(private readonly logger: LoggerService) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  handleCron() {
    this.logger.debug('Called every 5 seconds');
  }
}
