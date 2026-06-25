import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { DbContext } from './db-context';

@Injectable()
export class UnitOfWork {
	constructor(private readonly prisma: PrismaService) {}

	async run<T>(fn: (ctx: DbContext) => Promise<T>): Promise<T> {
		return this.prisma.$transaction(async (tx) => {
			const ctx = new DbContext(this.prisma, tx);
			return fn(ctx);
		});
	}
}
