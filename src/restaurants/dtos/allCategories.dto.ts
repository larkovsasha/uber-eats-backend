import { CoreOutput } from '../../common/dtos/output.dto';
import { Field, ObjectType } from '@nestjs/graphql';
import { CategoryEntity } from '../entities/category.entity';

@ObjectType()
export class AllCategoriesOutput extends CoreOutput {
  @Field((type) => [CategoryEntity], { nullable: true })
  categories?: CategoryEntity[];
}
