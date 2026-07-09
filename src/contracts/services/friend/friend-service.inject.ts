import { Inject } from '@nestjs/common';
import { FRIEND_SERVICE } from './friend-service.port';

export const InjectFriendService = () => Inject(FRIEND_SERVICE);
