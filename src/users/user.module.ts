import { Module, forwardRef } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { LoggerService } from '../logger/custom.logger';
import { ProductRepository } from '../product/product.repository';
import { UserSubscriber } from './subscriber/user.subscriber';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, ProductRepository]),
    ConfigService,
    LoggerService,
    forwardRef(() => AuthModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecretKey'),
        signOptions: {
          expiresIn: configService.get<string>('jwtExpiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    UserSubscriber,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    UserService,
    AuthService,
  ],
  controllers: [UserController],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
