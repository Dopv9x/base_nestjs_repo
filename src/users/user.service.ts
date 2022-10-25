import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { PageMetaDto } from '../common/dto/pagination-meta.dto';
import { PageOptionsDto } from '../common/dto/pagination-options.dto';
import { PageDto } from '../common/dto/pagination.dto';
import { LoggerService } from '../logger/custom.logger';
import { Product } from '../product/product.entity';
import { ProductRepository } from '../product/product.repository';
import { BaseService } from '../utils/base.service';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService extends BaseService<User, UserRepository> {
  @InjectRepository(Product)
  private productRepository: ProductRepository;

  constructor(
    repository: UserRepository,
    logger: LoggerService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {
    super(repository, logger);
  }

  async findAllAndPaging(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<User>> {
    const qb = this.repository.createQueryBuilder('user');
    qb.orderBy('user.createdat', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.limit);

    const itemCount = await qb.getCount();
    const { entities } = await qb.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  findUserAndProduct(): Promise<Product[]> {
    return this.productRepository.getAllProducts();
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ email: email });
  }

  getInactiveUsers(): Promise<User[]> {
    return this.repository.getInactiveUsers();
  }
}
