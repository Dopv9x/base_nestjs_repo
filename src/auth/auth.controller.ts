import { Body, Controller, Post } from '@nestjs/common';
import { UserInfo } from '../common/user-info';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user.dto';

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
