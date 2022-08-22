import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CategoryEntity } from '../entities/category.entity';
import { GetWithPaginationRepository } from '../../common/repositories/withPagination.repository';

@Injectable()
export class CategoryRepository extends GetWithPaginationRepository<CategoryEntity>(
  CategoryEntity,
) {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }
  async getOrCreate(name: string): Promise<CategoryEntity> {
    const categoryName = name.trim().toLowerCase();
    const categorySlug = categoryName.replace(/ /g, '-');
    let category = await this.findOne({
      where: { slug: categorySlug },
    });
    if (!category) {
      category = await this.save(
        this.create({
          slug: categorySlug,
          name: categoryName,
        }),
      );
    }
    return category;
  }
}
