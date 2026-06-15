import { type Env } from '@/modules/env/providers/env.provider';
import { InjectEnv } from '@/modules/env/injects/env.inject';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma-generated/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	constructor(@InjectEnv() env: Env) {
		const url = env.databaseUrl;
		const adapter = new PrismaPg({ connectionString: url });
		super({ adapter });
	}

	async onModuleInit() {
		await this.$connect();
	}

	async onModuleDestroy() {
		await this.$disconnect();
	}
}
