import { PrismaService } from '@/common/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRepository {
	constructor(private prisma: PrismaService) {}
}
