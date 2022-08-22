import { DataSource, Repository } from 'typeorm';
import { CategoryEntity } from '../../restaurants/entities/category.entity';
import { PaginationInput } from '../dtos/pagination.dto';
import { Field } from '@nestjs/graphql';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';

export class findWithPaginationResult<T> {
  totalPages?: number;
  totalItems?: number;
  items?: T[];
}

export const GetWithPaginationRepository = <T>(Entity) => {
  return class WithPaginationRepository extends Repository<T> {
    constructor(dataSource: DataSource) {
      super(Entity, dataSource.createEntityManager());
    }

    public async findWithPagination(
      { page, itemsInPage }: PaginationInput,
      options?: FindManyOptions<T>,
    ): Promise<findWithPaginationResult<T>> {
      try {
        const [items, itemsCount] = await this.findAndCount({
          ...options,
          take: itemsInPage,
          skip: (page - 1) * itemsInPage,
        });
        return {
          totalItems: itemsCount,
          totalPages: Math.ceil(itemsCount / itemsInPage),
          items: items,
        };
      } catch (e) {
        throw new Error(e);
      }
    }
  };
};
