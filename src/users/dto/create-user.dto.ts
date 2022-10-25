import {
  IsNotEmpty,
  IsEmail,
  Validate,
  Length,
  IsBoolean,
} from 'class-validator';
import { PasswordConfirmValidator } from '../../../src/validators/password-confirm.validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @Length(8, 24)
  password: string;

  @IsNotEmpty()
  @Validate(PasswordConfirmValidator, ['password'])
  password_confirmation: string;

  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
