import { RefreshToken } from '@prisma-generated/client';

export type RefreshTokenStatus = Pick<RefreshToken, 'expiredAt' | 'isRevoked'>;
