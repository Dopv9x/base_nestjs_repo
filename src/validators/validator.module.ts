import { Global, Module } from '@nestjs/common';
import { PasswordConfirmValidator } from './password-confirm.validator';
import { UniqueEmailValidator } from './unique-email.validator';
import { UserModule } from '@src/users/user.module';
import { UserService } from '@src/users/user.service';
import { AuthService } from '@src/auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from '@src/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@src/users/user.repository';
import { ProductRepository } from '@src/product/product.repository';

@Global()
@Module({
  imports: [
    UserModule,
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
    PasswordConfirmValidator,
    UniqueEmailValidator,
    UserService,
    AuthService,
    UserRepository,
  ],
  exports: [PasswordConfirmValidator, UniqueEmailValidator],
})
export class ValidatorModule {}
