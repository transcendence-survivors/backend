import { ThrottlerModuleOptions } from '@nestjs/throttler';

export const RATE_LIMIT_TIERS: ThrottlerModuleOptions = [
	{
		name: 'burst',
		ttl: 1_000, // 1 second
		limit: 10,
	},
	{
		name: 'sustained',
		ttl: 60_000, // 1 minute
		limit: 300,
	},
	{
		name: 'daily',
		ttl: 86_400_000, // 24 hours
		limit: 20_000,
	},
];
