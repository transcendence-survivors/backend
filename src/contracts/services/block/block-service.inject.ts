import { Inject } from '@nestjs/common';
import { BLOCK_SERVICE } from './block-service.port';

export const InjectBlockService = () => Inject(BLOCK_SERVICE);
