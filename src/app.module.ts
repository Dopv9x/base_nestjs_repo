import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ThrottlerBehindProxyGuard } from './auth/guards/throttler-proxy.guard';
import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import databaseConfig from './config/database.config';
import { DatabaseModule } from './database/database.module';
import { AllExceptionFilter } from './filter/exception.filter';
import { LoggerModule } from './logger/logger.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { ProductModule } from './product/product.module';
import { SchedulesModule } from './schedules/schedules.module';
import { UserRepository } from './users/user.repository';
import { ValidatorModule } from './validators/validator.module';

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
