import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { VerificationEntity } from './entities/verification.entity';
import { CategoryRepository } from '../restaurants/repositories/category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, VerificationEntity])],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
