import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	UseGuards,
} from '@nestjs/common';
import { GameService } from '../services/game.service';
import { JWTGameGuard } from '@/core/security/guards/jwt-game-access-guard';
import { CreateGameStatsDto } from '../dtos/requests/create-game-stats.dto.ts';
import { ApiBodyDto } from '@/shared/decorators/api-body-dto.decorator';
import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';
import { ApiParam } from '@nestjs/swagger';
import { UserGameSummaryResponseDto } from '../dtos/responses/user-game-summary-response.dto';
import { ApiSuccessResponse } from '@/shared/decorators/api-success-response.decorator';

@Controller('game')
export class GameController {
	constructor(private readonly service: GameService) {}

	@UseGuards(JWTGameGuard)
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiBodyDto(CreateGameStatsDto)
	@ResponseEnvelope('Game stats uploaded successfully')
	upload(@Body() dto: CreateGameStatsDto): Promise<{ gameId: string }> {
		return this.service.recordGame(dto);
	}

	@Get(':userId/summary')
	@HttpCode(HttpStatus.OK)
	@ApiParam({ name: 'userId', type: 'string', description: 'User ID' })
	@ApiSuccessResponse(UserGameSummaryResponseDto)
	@ResponseEnvelope('User game summary retrieved successfully')
	async getUserSummary(
		@Param('userId') userId: string,
	): Promise<UserGameSummaryResponseDto> {
		return this.service.getUserSummary(userId);
	}
}
