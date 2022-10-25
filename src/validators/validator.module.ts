import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { UserModule } from '../users/user.module';
import { UserRepository } from '../users/user.repository';
import { UserService } from '../users/user.service';
import { PasswordConfirmValidator } from './password-confirm.validator';

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
    UserService,
    AuthService,
    UserRepository,
  ],
  exports: [PasswordConfirmValidator],
})
export class ValidatorModule {}
