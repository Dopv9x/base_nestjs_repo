import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '../../src/users/user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { EntityId } from 'typeorm/repository/EntityId';
import { plainToClass } from 'class-transformer';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteResult } from 'typeorm/index';
import { Query } from '@nestjs/common';
import { Roles } from '../../src/decorators/roles.decorator';
import { Role } from '../../src/enum/role.enum';
import { AuthUser } from '../../src/decorators/auth.user.decorator';
import { UserInfo } from '../../src/common/user-info';
import { PageOptionsDto } from '../../src/common/dto/pagination-options.dto';
import { PageDto } from '../../src/common/dto/pagination.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(Role.Admin)
  async index(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
    return await this.userService.findAllAndPaging(pageOptionsDto);
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
