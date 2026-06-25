import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma-generated/enums';

export const ROLE_KEY = 'role';

export const Roles = (...role: UserRole[]) => SetMetadata(ROLE_KEY, role);
