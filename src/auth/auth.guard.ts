import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { AllowedRoles } from './role.decorator';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles: AllowedRoles = this.reflector.get<AllowedRoles>(
      'roles',
      context.getHandler(),
    );

    // it means that endpoint is public and req doesn't have auth user data
    if (!roles) return true;

    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user: UserEntity = gqlContext.user;

    if (!user) throw new UnauthorizedException();
    if (roles.includes('ANY')) return true;
    return roles.includes(user.role);
  }
}
