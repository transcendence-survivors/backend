export interface ChatMemberFindParams {
	roomId: string;
	userId: string;
}

export interface ChatMembershipsInRoomsParams {
	userId: string;
	roomIds: string[];
}
