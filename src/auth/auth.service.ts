import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../users/user.service';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserInfo } from '@common/user-info';
import { UserLoginDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '@src/users/user.repository';
import { ApiError } from '@src/filter/api.error';
import { Role } from '@src/enum/role.enum';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from '@src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  @InjectRepository(UserRepository)
  private userRepository: UserRepository;

  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Username or password is incorrect');
    }
    const compareResult = await bcrypt.compare(password, user.password);

    if (!compareResult) {
      throw new UnauthorizedException('Username or password is incorrect');
    }

    return user;
  }

  async registerUser(body: CreateUserDto): Promise<UserInfo> {
    const userExist = await this.userRepository.findOne({
      email: body.email,
      isActive: true,
    });

    if (userExist) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'user existed');
    }

    const data = await this.userRepository.save({
      ...body,
      roles: Role.User,
    });

    return plainToClass(UserInfo, data, {
      excludeExtraneousValues: true,
    });
  }

  async generateJwtToken(user: UserLoginDto): Promise<UserInfo> {
    const currentUser = await this.userRepository.findOne({
      email: user.email,
      isActive: true,
    });

    if (!currentUser) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'User not found');
    }

    const isMatch = await bcrypt.compare(user.password, currentUser.password);

    if (!isMatch) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Password wrong');
    }

    const payload: UserInfo = {
      id: currentUser.id,
      email: currentUser.email,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      roles: currentUser.roles,
    };
    // const access_token = await this.jwtService.signAsync(payload, {
    //   expiresIn: this.configService.get<string>('jwtExpiresIn'),
    // });

    return { ...payload, token: 'access_token' };
  }
}
