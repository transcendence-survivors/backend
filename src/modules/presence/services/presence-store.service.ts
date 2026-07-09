import { IPresenceStore } from '@/contracts/services/presence/presence-store.port';
import { Injectable } from '@nestjs/common';
import { PresenceStatusEnum } from '../types/enums/presence-status.enum';
import { PresenceRemove } from '../types/records/presence-disconnect.type';

interface PresenceEntry {
	sockets: Set<string>;
	status: PresenceStatusEnum;
}

@Injectable()
export class PresenceStoreService implements IPresenceStore {
	private readonly users = new Map<string, PresenceEntry>();
	private readonly socketToUser = new Map<string, string>();
	private readonly disconnectTimers = new Map<string, NodeJS.Timeout>();

	addConnection(userId: string, socketId: string): boolean {
		this.socketToUser.set(socketId, userId);

		let user = this.users.get(userId);
		if (!user) {
			user = {
				sockets: new Set<string>(),
				status: PresenceStatusEnum.ONLINE,
			};
			this.users.set(userId, user);
		}
		const isFirstSession = user.sockets.size === 0;
		user.sockets.add(socketId);
		return isFirstSession;
	}

	removeConnection(socketId: string): PresenceRemove {
		const userId = this.socketToUser.get(socketId);
		if (!userId) {
			return { isCompletelyOffline: false };
		}

		this.socketToUser.delete(socketId);
		const user = this.users.get(userId);
		if (user) {
			user.sockets.delete(socketId);
			if (user.sockets.size === 0) {
				return { userId, isCompletelyOffline: true };
			}
		}
		return { userId, isCompletelyOffline: false };
	}

	getStatus(userId: string): PresenceStatusEnum {
		const user = this.users.get(userId);
		return user ? user.status : PresenceStatusEnum.OFFLINE;
	}
	setStatus(userId: string, status: PresenceStatusEnum): void {
		const user = this.users.get(userId);
		if (user) {
			user.status = status;
		}
	}
	getOnlineUserCount(): number {
		const notInvisibleUsers = Array.from(this.users.values()).filter(
			(user) => user.status !== PresenceStatusEnum.INVISIBLE,
		);
		return notInvisibleUsers.length;
	}

	finalizeOffline(userId: string): void {
		const user = this.users.get(userId);
		if (user && user.sockets.size === 0) {
			this.users.delete(userId);
		}
	}

	setDisconnectTimer(userId: string, timer: NodeJS.Timeout): void {
		this.clearDisconnectTimer(userId);
		this.disconnectTimers.set(userId, timer);
	}

	clearDisconnectTimer(userId: string): void {
		const timer = this.disconnectTimers.get(userId);
		if (timer) {
			clearTimeout(timer);
			this.disconnectTimers.delete(userId);
		}
	}

	clearAllDisconnectTimers(): void {
		for (const timer of this.disconnectTimers.values()) {
			clearTimeout(timer);
		}
		this.disconnectTimers.clear();
	}

	hasPendingDisconnect(userId: string): boolean {
		return this.disconnectTimers.has(userId);
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
		return (
			user.status !== PresenceStatusEnum.OFFLINE && user.sockets.size > 0
		);
	}
}
