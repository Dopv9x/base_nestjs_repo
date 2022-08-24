import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserSubscriber } from './subscriber/user.subscriber';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '@src/auth/guards/roles.guard';
import { ProductRepository } from '@src/product/product.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerService } from '@src/logger/custom.logger';
import { AuthModule } from '@src/auth/auth.module';
import { AuthService } from '@src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

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
