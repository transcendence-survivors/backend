import { PrismaService } from '@/core/database/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { RelationshipStatusParams } from '../types/params/relationship-status.params';
import { BlockRelationship } from '../types/records/block-relationship.type copy';
import { FriendshipRelationship } from '../types/records/friendship-relationship.type';

@Injectable()
export class RelationshipRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findBlocksBetween({
		userId1,
		userId2,
	}: RelationshipStatusParams): Promise<BlockRelationship[]> {
		return this.prisma.block.findMany({
			where: {
				OR: [
					{ blockerId: userId1, blockedId: userId2 },
					{ blockerId: userId2, blockedId: userId1 },
				],
			},
			select: {
				blockerId: true,
				blockedId: true,
			},
		});
	}

	async findFriendshipBetween({
		userId1,
		userId2,
	}: RelationshipStatusParams): Promise<FriendshipRelationship | null> {
		return this.prisma.friendship.findFirst({
			where: {
				OR: [
					{ userAId: userId1, userBId: userId2 },
					{ userAId: userId2, userBId: userId1 },
				],
			},
			select: {
				senderId: true,
				state: true,
			},
		});
	}
}
