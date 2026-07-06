import { RefreshTokenMeta } from '../records/refresh-token-meta.type';

export interface RefreshTokenCreateParams {
	hashedToken: string;
	expireInMs: number;
	userId: string;
	meta?: RefreshTokenMeta;
}
