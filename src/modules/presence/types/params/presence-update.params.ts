import { PresencePreferedStatus } from '@prisma-generated/enums';

export interface PresenceUpdateParams {
	status: PresencePreferedStatus;
	userId: string;
}
