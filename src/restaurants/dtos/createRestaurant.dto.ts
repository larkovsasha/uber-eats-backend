import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { RestaurantEntity } from '../entities/restaurant.entity';
import { CoreOutput } from '../../common/dtos/output.dto';

@InputType()
export class CreateRestaurantInput extends PickType<
  RestaurantEntity,
  'name' | 'bgImage' | 'address'
>(RestaurantEntity, ['name', 'bgImage', 'address']) {
  @Field((type) => String)
  categoryName: string;
}

@ObjectType()
export class CreateRestaurantOutput extends CoreOutput {}
