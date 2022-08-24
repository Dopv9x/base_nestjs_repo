import { Expose } from 'class-transformer';
import { PageOptionsDto } from './pagination-options.dto';

export interface PageMetaDtoParameters {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
}

export class PageMetaDto {
  @Expose()
  readonly page: number;

  @Expose()
  readonly limit: number;

  @Expose()
  readonly itemCount: number;

  @Expose()
  readonly pageCount: number;

  @Expose()
  readonly hasPreviousPage: boolean;

  @Expose()
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.page = pageOptionsDto.page;
    this.limit = pageOptionsDto.limit;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.limit);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
