import { PresencePreferedStatus } from '@prisma-generated/enums';

export const PresenceStatusEnum = {
	...PresencePreferedStatus,
	OFFLINE: 'OFFLINE',
} as const;

export type PresenceStatusEnum =
	(typeof PresenceStatusEnum)[keyof typeof PresenceStatusEnum];
