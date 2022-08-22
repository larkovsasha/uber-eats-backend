import { Module } from '@nestjs/common';
import { CategoryResolver, RestaurantsResolver } from './restaurants.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from './entities/restaurant.entity';
import { RestaurantsService } from './restaurants.service';
import { CategoryEntity } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';
import { RestaurantRepository } from './repositories/restaurant.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity, CategoryEntity])],
  providers: [
    RestaurantsResolver,
    CategoryResolver,
    RestaurantsService,
    CategoryRepository,
    RestaurantRepository,
  ],
})
export class RestaurantsModule {}
