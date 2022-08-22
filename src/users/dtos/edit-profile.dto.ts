import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { UserEntity } from '../entities/user.entity';

@InputType()
export class EditProfileInput extends PartialType(
  PickType<UserEntity, 'password' | 'email'>(UserEntity, ['password', 'email']),
) {}

@ObjectType()
export class EditProfileOutput extends CoreOutput {}
