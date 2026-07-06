import { SkipThrottle, Throttle } from '@nestjs/throttler';

export const NoThrottle = () => SkipThrottle();

export const AuthThrottle = () =>
	Throttle({
		burst: { limit: 2, ttl: 1_000 },
		sustained: { limit: 5, ttl: 60_000 },
	});

export const StrictAuthThrottle = () =>
	Throttle({
		burst: { limit: 1, ttl: 1_000 },
		sustained: { limit: 3, ttl: 60_000 },
	});

export const TokenRefreshThrottle = () =>
	Throttle({
		burst: { limit: 5, ttl: 1_000 },
		sustained: { limit: 15, ttl: 60_000 },
	});

export const PostThrottle = () =>
	Throttle({
		burst: { limit: 2, ttl: 1_000 },
		sustained: { limit: 20, ttl: 60_000 },
	});

export const SearchThrottle = () =>
	Throttle({
		burst: { limit: 5, ttl: 1_000 },
		sustained: { limit: 40, ttl: 60_000 },
		daily: { limit: 2_000, ttl: 86_400_000 },
	});

export const RelationshipSearchThrottle = () =>
	Throttle({
		burst: { limit: 20, ttl: 1_000 },
		sustained: { limit: 100, ttl: 60_000 },
		daily: { limit: 10_000, ttl: 86_400_000 },
	});
