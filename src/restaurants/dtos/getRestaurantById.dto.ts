import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { RestaurantEntity } from '../entities/restaurant.entity';

@InputType()
export class GetRestaurantByIdInput {
  @Field((type) => Number)
  restaurantId: number;
}

@ObjectType()
export class GetRestaurantByIdOutput extends CoreOutput {
  @Field((type) => RestaurantEntity, { nullable: true })
  restaurant?: RestaurantEntity;
}
