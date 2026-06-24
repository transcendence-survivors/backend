import { Inject } from '@nestjs/common';
import { ENV } from '../providers/env.provider';

export const InjectEnv = () => Inject(ENV);
