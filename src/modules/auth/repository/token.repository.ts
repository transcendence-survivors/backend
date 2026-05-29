import { PrismaService } from '@/common/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenRepository {
	constructor(private prisma: PrismaService) {}

	storeRefreshToken() {}
}
