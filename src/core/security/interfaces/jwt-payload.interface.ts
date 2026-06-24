import { UserRole } from '@prisma-generated/enums';

interface JwtAccessPayload {
	sub: string;
	email: string;
	role: UserRole;
	username: string;
}

interface JwtRefreshPayload {
	sub: string;
	refreshToken: string;
}

export type { JwtAccessPayload, JwtRefreshPayload };
