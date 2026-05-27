import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma.service';
import { Pagination } from './player.types';
import { EditPlayerDto } from './dto/player.dto';

@Injectable()
export class PlayerRepository {
	constructor(private prisma: PrismaService) {}

	getPlayers({ page, size }: Pagination) {
		return this.prisma.player.findMany({
			skip: page * size - size,
			take: size,
		});
	}

	getPlayerByUsername(username: string) {
		return this.prisma.player.findUnique({
			where: {
				name: username,
			},
		});
	}

	createPlayer(username: string) {
		return this.prisma.player.create({ data: { name: username } });
	}

	editPlayer(id: string, query: EditPlayerDto) {
		return this.prisma.player.update({
			where: { id: id },
			data: {
				name: query.name,
				wins: query.wins,
				loses: query.loses,
				kills: query.kills,
			},
		});
	}

	deletePlayer(id: string) {
		return this.prisma.player.delete({ where: { name: id } });
	}
}
