import {
  UseInterceptors,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  Param,
  NotFoundException,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { DeleteResult } from 'typeorm';
import { EntityId } from 'typeorm/repository/EntityId';
import { PageOptionsDto } from '../common/dto/pagination-options.dto';
import { PageDto } from '../common/dto/pagination.dto';
import { UserInfo } from '../common/user-info';
import { AuthUser } from '../decorators/auth.user.decorator';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enum/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(Role.Admin)
  async index(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
    return this.userService.findAllAndPaging(pageOptionsDto);
  }

  @Get('/me')
  async myProfile(@AuthUser() authUser: UserInfo): Promise<UserInfo> {
    const user = await this.userService.findById(authUser.id);

    return plainToClass(UserInfo, user, {
      excludeExtraneousValues: true,
    });
  }

  @Get('/inactive')
  getInactiveUser(): Promise<User[]> {
    return this.userService.getInactiveUsers();
  }

  @Get('/:id')
  async show(@Param('id') id: EntityId): Promise<User> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  @Post()
  async create(@Body() userData: CreateUserDto): Promise<User> {
    const createdUser = await this.userService.store(userData);

    return plainToClass(User, createdUser);
  }

  @Put('/:id')
  update(
    @Param('id') id: EntityId,
    @Body() userData: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, userData);
  }

  @Delete('/:id')
  destroy(@Param('id') id: EntityId): Promise<DeleteResult> {
    return this.userService.delete(id);
  }
}
