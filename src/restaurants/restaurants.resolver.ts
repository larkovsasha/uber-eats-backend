import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { RestaurantEntity } from './entities/restaurant.entity';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/createRestaurant.dto';
import { RestaurantsService } from './restaurants.service';
import { UserEntity, UserRoleEnum } from '../users/entities/user.entity';
import { AuthUser } from '../auth/auth-user.decorator';
import { Role } from '../auth/role.decorator';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dtos/editRestaurant.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dtos/deleteRestaurant.dto';
import { CategoryEntity } from './entities/category.entity';
import { AllCategoriesOutput } from './dtos/allCategories.dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import {
  GetRestaurantsInput,
  GetRestaurantsOutput,
} from './dtos/getRestaurants.dto';
import {
  GetRestaurantByIdInput,
  GetRestaurantByIdOutput,
} from './dtos/getRestaurantById.dto';
import {
  SearchRestaurantInput,
  SearchRestaurantOutput,
} from './dtos/searchRestaurant.dto';

@Resolver((of) => RestaurantEntity)
export class RestaurantsResolver {
  constructor(private readonly restaurantService: RestaurantsService) {}

  @Mutation((returns) => CreateRestaurantOutput)
  @Role([UserRoleEnum.OWNER])
  async createRestaurants(
    @AuthUser() user: UserEntity,
    @Args('input')
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    return await this.restaurantService.createRestaurant(
      user,
      createRestaurantInput,
    );
  }

  @Mutation((returns) => EditRestaurantOutput)
  @Role([UserRoleEnum.OWNER])
  async editRestaurant(
    @AuthUser() owner: UserEntity,
    @Args('input') editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    return await this.restaurantService.editRestaurant(
      owner,
      editRestaurantInput,
    );
  }

  @Mutation((returns) => DeleteRestaurantOutput)
  @Role([UserRoleEnum.OWNER])
  async deleteRestaurant(
    @AuthUser() owner: UserEntity,
    @Args('input') deleteRestaurantInput: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    return await this.restaurantService.deleteRestaurant(
      owner,
      deleteRestaurantInput,
    );
  }
}

@Resolver((of) => CategoryEntity)
export class CategoryResolver {
  constructor(private readonly restaurantService: RestaurantsService) {}

  @ResolveField((type) => Int)
  async restaurantCount(@Parent() category: CategoryEntity): Promise<number> {
    return await this.restaurantService.countRestaurants(category);
  }
  @Query((returns) => AllCategoriesOutput)
  async allCategories(): Promise<AllCategoriesOutput> {
    return await this.restaurantService.allCategories();
  }

  @Query((returns) => CategoryOutput)
  async getCategory(
    @Args('input') categoryInput: CategoryInput,
  ): Promise<CategoryOutput> {
    return await this.restaurantService.findCategoryBySlug(categoryInput);
  }

  @Query((returns) => GetRestaurantsOutput)
  async getRestaurants(
    @Args('input') restaurantsInput: GetRestaurantsInput,
  ): Promise<GetRestaurantsOutput> {
    return await this.restaurantService.getRestaurants(restaurantsInput);
  }

  @Query((returns) => GetRestaurantByIdOutput)
  async getRestaurantById(
    @Args('input') restaurantInput: GetRestaurantByIdInput,
  ): Promise<GetRestaurantByIdOutput> {
    return await this.restaurantService.getRestaurantById(restaurantInput);
  }

  @Query((returns) => SearchRestaurantOutput)
  async searchRestaurant(
    @Args('input') searchRestaurantInput: SearchRestaurantInput,
  ): Promise<SearchRestaurantOutput> {
    return await this.restaurantService.getRestaurantByName(
      searchRestaurantInput,
    );
  }
}
