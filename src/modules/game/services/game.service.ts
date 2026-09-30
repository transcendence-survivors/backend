import { Injectable } from '@nestjs/common';
import { GameRepository } from '../repositories/game.repository';

@Injectable()
export class GameService {
	constructor(private readonly repo: GameRepository) {}
}
