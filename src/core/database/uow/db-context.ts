import type { PrismaClient, Prisma } from '@prisma-generated/client';

export class DbContext {
	constructor(
		public readonly prisma: PrismaClient,
		public readonly tx?: Prisma.TransactionClient,
	) {}

	get client() {
		return this.tx ?? this.prisma;
	}
}
