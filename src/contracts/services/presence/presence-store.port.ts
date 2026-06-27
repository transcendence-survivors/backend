export const PRESENCE_STORE = Symbol('PRESENCE_STORE');

export interface IPresenceStore {
	getSocketsByUserId(userId: string): string[];
	isUserOnline(userId: string): boolean;
}
