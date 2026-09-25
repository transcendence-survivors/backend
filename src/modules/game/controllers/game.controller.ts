import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GameService } from '../services/game.service';
import { GameStatsDto } from '../dtos/requests/game-upload.dto';
import { JWTGameGuard } from '@/core/security/guards/jwt-game-access-guard';

@Controller('game')
export class GameController {
	constructor(private readonly service: GameService) {}

	@UseGuards(JWTGameGuard)
	@Post()
	upload(@Body() dto: GameStatsDto) {
		console.log(dto);
	}
}
