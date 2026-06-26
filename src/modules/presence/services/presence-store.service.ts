// shared/services/realtime-store.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class PresenceStoreService {
	private readonly userToSockets = new Map<string, Set<string>>();
	private readonly socketToUser = new Map<string, string>();

	addConnection(userId: string, socketId: string): boolean {
		this.socketToUser.set(socketId, userId);

		let sockets = this.userToSockets.get(userId);
		if (!sockets) {
			sockets = new Set<string>();
			this.userToSockets.set(userId, sockets);
		}
		const isFirstSession = sockets.size === 0;
		sockets.add(socketId);
		return isFirstSession;
	}

	removeConnection(socketId: string): {
		userId: string | undefined;
		isCompletelyOffline: boolean;
	} {
		const userId = this.socketToUser.get(socketId);
		if (!userId) {
			return { userId: undefined, isCompletelyOffline: false };
		}

		this.socketToUser.delete(socketId);
		const sockets = this.userToSockets.get(userId);
		if (sockets) {
			sockets.delete(socketId);
			if (sockets.size === 0) {
				this.userToSockets.delete(userId);
				return { userId, isCompletelyOffline: true };
			}
		}
		return { userId, isCompletelyOffline: false };
	}

	getSocketsByUserId(userId: string): string[] {
		const sockets = this.userToSockets.get(userId);
		return sockets ? Array.from(sockets) : [];
	}

	getOnlineUserCount(): number {
		return this.userToSockets.size;
	}

	isUserOnline(userId: string): boolean {
		return this.userToSockets.has(userId);
	}
}
