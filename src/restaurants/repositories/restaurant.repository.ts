import { Injectable } from '@nestjs/common';
import { GetWithPaginationRepository } from '../../common/repositories/withPagination.repository';
import { CategoryEntity } from '../entities/category.entity';
import { DataSource } from 'typeorm';
import { RestaurantEntity } from '../entities/restaurant.entity';

@Injectable()
export class RestaurantRepository extends GetWithPaginationRepository<RestaurantEntity>(
  RestaurantEntity,
) {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }
}
