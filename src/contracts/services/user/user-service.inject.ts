import { Inject } from '@nestjs/common';
import { USER_SERVICE } from './user-service.port';

export const InjectUserService = () => Inject(USER_SERVICE);
