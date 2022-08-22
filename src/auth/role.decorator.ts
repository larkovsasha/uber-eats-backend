import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from '../users/entities/user.entity';

export type AllowedRoles = `${UserRoleEnum}` | 'ANY';

export const Role = (roles: AllowedRoles[]) => SetMetadata('roles', roles);
