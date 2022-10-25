import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/custom.logger';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../src/product/product.entity';
import { ProductRepository } from '../../src/product/product.repository';
import { PageMetaDto } from '../../src/common/dto/pagination-meta.dto';
import { BaseService } from '../../src/utils/base.service';
import { AuthService } from '../../src/auth/auth.service';
import { PageOptionsDto } from '../../src/common/dto/pagination-options.dto';
import { PageDto } from '../../src/common/dto/pagination.dto';

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
