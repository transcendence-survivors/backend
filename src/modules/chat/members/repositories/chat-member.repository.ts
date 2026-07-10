import { PrismaService } from '@/core/database/services/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatMemberRepository {
	constructor(private readonly prisma: PrismaService) {}
}
