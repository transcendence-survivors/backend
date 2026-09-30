import { PrismaService } from '@/core/database/services/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameRepository {
	constructor(private readonly prisma: PrismaService) {}
}
