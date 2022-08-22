import { Injectable } from '@nestjs/common';
import { RestaurantEntity } from './entities/restaurant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Like, Repository } from 'typeorm';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/createRestaurant.dto';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dtos/editRestaurant.dto';
import { UserEntity } from '../users/entities/user.entity';
import { CategoryEntity } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dtos/deleteRestaurant.dto';
import { AllCategoriesOutput } from './dtos/allCategories.dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import {
  GetRestaurantsInput,
  GetRestaurantsOutput,
} from './dtos/getRestaurants.dto';
import { take } from 'rxjs';
import {
  GetRestaurantByIdInput,
  GetRestaurantByIdOutput,
} from './dtos/getRestaurantById.dto';
import {
  SearchRestaurantInput,
  SearchRestaurantOutput,
} from './dtos/searchRestaurant.dto';
import { RestaurantRepository } from './repositories/restaurant.repository';

@Injectable()
export class RestaurantsService {
  constructor(
    private readonly restaurantRepository: RestaurantRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async createRestaurant(
    owner: UserEntity,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const restaurant = this.restaurantRepository.create(
        createRestaurantInput,
      );
      restaurant.owner = owner;

      const category = await this.categoryRepository.getOrCreate(
        createRestaurantInput.categoryName,
      );

      restaurant.category = category;
      await this.restaurantRepository.save(restaurant);
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: 'Could not create new restaurant',
      };
    }
  }

  async editRestaurant(
    owner: UserEntity,
    editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    try {
      const restaurant = await this.restaurantRepository.findOne({
        where: { id: editRestaurantInput.restaurantId },
      });

      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }

      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: 'You can not edit a restaurant that you do not own',
        };
      }

      let category: CategoryEntity = null;
      if (editRestaurantInput.categoryName) {
        category = await this.categoryRepository.getOrCreate(
          editRestaurantInput.categoryName,
        );
      }

      await this.restaurantRepository.save([
        {
          id: editRestaurantInput.restaurantId,
          ...editRestaurantInput,
          ...(category && { category }),
        },
      ]);
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return { ok: false, error: 'Could not update restaurant' };
    }
  }

  async deleteRestaurant(
    owner: UserEntity,
    { restaurantId }: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    try {
      const restaurant = await this.restaurantRepository.findOne({
        where: { id: restaurantId },
      });

      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }

      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: 'You can not edit a restaurant that you do not own',
        };
      }

      await this.restaurantRepository.delete({ id: restaurantId });

      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: 'Could not delete this restaurant',
      };
    }
  }

  async allCategories(): Promise<AllCategoriesOutput> {
    try {
      const categories = await this.categoryRepository.find();
      return {
        ok: true,
        categories,
      };
    } catch (e) {
      return {
        ok: false,
        error: 'Could not get categories',
      };
    }
  }

  async countRestaurants(category: CategoryEntity): Promise<number> {
    try {
      const res = await this.restaurantRepository.count({
        where: {
          category: {
            id: category.id,
          },
        },
      });
      return res;
    } catch (e) {
      console.log(e);
      return NaN;
    }
  }

  async findCategoryBySlug({
    slug,
    page,
    itemsInPage,
  }: CategoryInput): Promise<CategoryOutput> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { slug },
        relations: ['restaurants'],
      });
      if (!category) {
        return {
          ok: false,
          error: 'Category not found',
        };
      }

      const restaurants = await this.restaurantRepository.find({
        where: {
          category: {
            id: category.id,
          },
        },
        take: itemsInPage,
        skip: (page - 1) * itemsInPage,
      });

      const totalRestaurants = await this.countRestaurants(category);

      return {
        ok: true,
        category,
        totalPages: Math.ceil(totalRestaurants / itemsInPage),
        restaurants,
        totalItems: totalRestaurants,
      };
    } catch (e) {
      console.log(e);
      return { ok: false, error: 'Could not get category ' };
    }
  }

  async getRestaurants(
    getRestaurantsInput: GetRestaurantsInput,
  ): Promise<GetRestaurantsOutput> {
    try {
      const { totalItems, totalPages, items } =
        await this.restaurantRepository.findWithPagination(getRestaurantsInput);
      return {
        ok: true,
        restaurants: items,
        totalPages,
        totalItems,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: 'Could not load restaurants',
      };
    }
  }

  async getRestaurantById({
    restaurantId,
  }: GetRestaurantByIdInput): Promise<GetRestaurantByIdOutput> {
    try {
      const restaurant = await this.restaurantRepository.findOneOrFail({
        where: {
          id: restaurantId,
        },
      });
      return {
        ok: true,
        restaurant,
      };
    } catch (e) {
      return {
        ok: false,
        error: 'Could not find restaurant',
      };
    }
  }

  async getRestaurantByName({
    query,
    page,
    itemsInPage,
  }: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
    try {
      const { totalItems, totalPages, items } =
        await this.restaurantRepository.findWithPagination(
          {
            page,
            itemsInPage,
          },
          {
            where: {
              name: ILike(`%${query}%`),
            },
          },
        );

      return { ok: true, restaurants: items, totalItems, totalPages };
    } catch (e) {
      return {
        ok: false,
        error: 'Could not get restaurants',
      };
    }
  }
}
