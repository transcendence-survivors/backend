import { ThrottlerModuleOptions } from '@nestjs/throttler';

export const RATE_LIMIT_TIERS: ThrottlerModuleOptions = [
	{
		name: 'burst',
		ttl: 1_000,
		limit: 10,
	},
	{
		name: 'sustained',
		ttl: 60_000,
		limit: 300,
	},
	{
		name: 'daily',
		ttl: 86_400_000,
		limit: 20_000,
	},
];
