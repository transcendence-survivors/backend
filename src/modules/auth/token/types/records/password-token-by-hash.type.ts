import { ResetPasswordToken } from '@prisma-generated/browser';

export type PasswordTokenByHash = Pick<ResetPasswordToken, 'id' | 'userId'>;
