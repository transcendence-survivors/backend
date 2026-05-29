import { Inject } from '@nestjs/common';
import { ENV } from './env.provider';

export const InjectEnv = () => Inject(ENV);
