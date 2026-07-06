export interface PasswordTokenCreateParams {
	hashedToken: string;
	userId: string;
	expireInMs: number;
}
