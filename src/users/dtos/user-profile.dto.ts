import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '../entities/user.entity';
import { CoreOutput } from '../../common/dtos/output.dto';

@ArgsType()
export class UserProfileInput {
  @Field((type) => Number)
  userId: number;
}

@ObjectType()
export class UserProfileOutput extends CoreOutput {
  @Field((type) => UserEntity, { nullable: true })
  user?: UserEntity;
}
