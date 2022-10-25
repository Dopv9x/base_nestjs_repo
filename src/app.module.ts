import appConfig from '../../src/configapp.config';
import authConfig from '../../src/configauth.config';
import databaseConfig from '../../src/configdatabase.config';
import { AuthMiddleware } from '../../src/middlewares/auth.middleware';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerBehindProxyGuard } from '../../src/auth/guards/throttler-proxy.guard';
import { ValidatorModule } from '../../src/validators/validator.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { AllExceptionFilter } from './filter/exception.filter';
import { LoggerModule } from './logger/logger.module';
import { ProductModule } from './product/product.module';
import { SchedulesModule } from './schedules/schedules.module';
import { UserRepository } from './users/user.repository';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, authConfig],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get<number>('throttleTtl'),
        limit: config.get<number>('throttleLimit'),
      }),
    }),
    TypeOrmModule.forFeature([UserRepository]),
    LoggerModule,
    AuthModule,
    ValidatorModule,
    DatabaseModule,
    ProductModule,
    SchedulesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: '(.*)auth(.*)', method: RequestMethod.ALL })
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
