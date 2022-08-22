import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { AuthUser } from '../auth/auth-user.decorator';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto';
import { Role } from '../auth/role.decorator';

@Resolver((of) => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation((returns) => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return await this.usersService.createAccount(createAccountInput);
  }

  @Mutation((returns) => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return await this.usersService.login(loginInput);
  }

  @Role(['ANY'])
  @Mutation((returns) => EditProfileOutput)
  async editProfile(
    @AuthUser() user: UserEntity,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    return await this.usersService.editProfile(user.id, editProfileInput);
  }

  @Query((returns) => UserEntity)
  @Role(['ANY'])
  async me(@AuthUser() user: UserEntity): Promise<UserEntity> {
    return user;
  }

  @Query((returns) => UserProfileOutput)
  @Role(['ANY'])
  async userProfile(
    @Args() { userId }: UserProfileInput,
  ): Promise<UserProfileOutput> {
    return await this.usersService.findById(userId);
  }

  @Mutation((returns) => VerifyEmailOutput)
  @Role(['ANY'])
  async verifyEmail(
    @Args('input') { code }: VerifyEmailInput,
  ): Promise<VerifyEmailOutput> {
    return await this.usersService.verifyEmail(code);
  }
}
