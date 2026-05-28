import { Injectable } from '@nestjs/common';
import { PlayerRepository } from './player.repository';
import { Pagination } from './player.types';
import { EditPlayerDto } from './dto/player.dto';

@Injectable()
export class PlayerService {
	constructor(private repo: PlayerRepository) {}

	getPlayers(pagination: Pagination) {
		return this.repo.getPlayers(pagination);
	}

	getPlayerByUsername(username: string) {
		return this.repo.getPlayerByUsername(username);
	}

	createPlayer(id: string) {
		return this.repo.createPlayer(id);
	}

	editPlayer(id: string, query: EditPlayerDto) {
		return this.repo.editPlayer(id, query);
	}

	deletePlayer(id: string) {
		return this.repo.deletePlayer(id);
	}
}
