import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user.dto';
import { UserInfo } from '../../src/common/user-info';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() body: UserLoginDto): Promise<UserInfo> {
    return this.authService.generateJwtToken(body);
  }

  @Post('/register')
  register(@Body() body: CreateUserDto): Promise<UserInfo> {
    return this.authService.registerUser(body);
  }
}
