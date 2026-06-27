import { IPresenceStore } from '@/contracts/services/presence/presence-store.port';
import { Injectable } from '@nestjs/common';
import { PresenceStatus } from '../intefaces/presence.interface';

interface PresenceEntry {
	sockets: Set<string>;
	status: PresenceStatus;
}

@Injectable()
export class PresenceStoreService implements IPresenceStore {
	private readonly users = new Map<string, PresenceEntry>();
	private readonly socketToUser = new Map<string, string>();

	addConnection(userId: string, socketId: string): boolean {
		this.socketToUser.set(socketId, userId);

		let user = this.users.get(userId);
		if (!user) {
			user = {
				sockets: new Set<string>(),
				status: PresenceStatus.ONLINE,
			};
			this.users.set(userId, user);
		}
		const isFirstSession = user.sockets.size === 0;
		user.sockets.add(socketId);
		return isFirstSession;
	}

	removeConnection(socketId: string): {
		userId?: string;
		isCompletelyOffline: boolean;
	} {
		const userId = this.socketToUser.get(socketId);
		if (!userId) {
			return { isCompletelyOffline: false };
		}

		this.socketToUser.delete(socketId);
		const user = this.users.get(userId);
		if (user) {
			user.sockets.delete(socketId);
			if (user.sockets.size === 0) {
				this.users.delete(userId);
				return { userId, isCompletelyOffline: true };
			}
		}
		return { userId, isCompletelyOffline: false };
	}

	getStatus(userId: string) {
		const user = this.users.get(userId);
		return user ? user.status : undefined;
	}
	setStatus(userId: string, status: PresenceStatus): void {
		const user = this.users.get(userId);
		if (user) {
			user.status = status;
		}
	}
	getOnlineUserCount(): number {
		const notInvisibleUsers = Array.from(this.users.values()).filter(
			(user) => user.status !== PresenceStatus.INVISIBLE,
		);
		return notInvisibleUsers.length;
	}

	public getSocketsByUserId(userId: string): string[] {
		const user = this.users.get(userId);
		return user ? Array.from(user.sockets) : [];
	}

	public isUserOnline(userId: string): boolean {
		const user = this.users.get(userId);
		if (!user) {
			return false;
		}
		return user.status !== PresenceStatus.OFFLINE && user.sockets.size > 0;
	}
}
