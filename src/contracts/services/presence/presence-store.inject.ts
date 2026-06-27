import { Inject } from '@nestjs/common';
import { PRESENCE_STORE } from './presence-store.port';

export const InjectPresenceStore = () => Inject(PRESENCE_STORE);
