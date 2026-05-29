import { Provider } from '@nestjs/common';
import { env, Env } from './env';

export const ENV = Symbol('ENV');

export const EnvProvider: Provider<Env> = {
	provide: ENV,
	useValue: env,
};
