import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Query,
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
import { GameStatsDetailsResponseDto } from '../dtos/responses/game-stats-details-response.dto';
import { ApiQueryDto } from '@/shared/decorators/api-query-dto.decorator';
import { GameStatsPaginateDto } from '../dtos/requests/game-stats-paginate.dto';
import { GameStatsPaginatedListResponseDto } from '../dtos/responses/game-stats-paginated-list-response.dto';
import { ApiValidationErrorResponse } from '@/shared/decorators/api-validation-error-response.decorator';
import { LeaderboardPaginateDto } from '../dtos/requests/leaderboard-paginate.dto.';
import { LeaderboardPaginatedListResponseDto } from '../dtos/responses/leaderboard-paginated-list-response.dto';

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

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiQueryDto(GameStatsPaginateDto)
	@ApiSuccessResponse(GameStatsPaginatedListResponseDto)
	@ApiValidationErrorResponse({
		limit: ['limit must be a number'],
		orderBy: ['orderBy must be a valid enum value'],
	})
	@ResponseEnvelope('Game stats listed successfully')
	list(
		@Query() query: GameStatsPaginateDto,
	): Promise<GameStatsPaginatedListResponseDto> {
		return this.service.listGames(query);
	}

	@Get('leaderboard')
	@HttpCode(HttpStatus.OK)
	@ApiQueryDto(LeaderboardPaginateDto)
	@ApiSuccessResponse(LeaderboardPaginatedListResponseDto)
	@ApiValidationErrorResponse({
		limit: ['limit must be a number'],
		orderBy: ['orderBy must be a valid enum value'],
	})
	@ResponseEnvelope('Leaderboard retrieved successfully')
	listLeaderboard(
		@Query() query: LeaderboardPaginateDto,
	): Promise<LeaderboardPaginatedListResponseDto> {
		return this.service.listLeaderboard(query);
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@ApiParam({
		name: 'id',
		type: 'string',
		description: 'Game UUID',
		example: 'c9bf9e57-1685-4c89-bafb-ff5af830be8a',
	})
	@ApiSuccessResponse(GameStatsDetailsResponseDto)
	@ResponseEnvelope('Game stats details retrieved successfully')
	async getGameStatsDetails(
		@Param('id') id: string,
	): Promise<GameStatsDetailsResponseDto> {
		return this.service.getGameStatsDetails(id);
	}

	@Get(':username/summary')
	@HttpCode(HttpStatus.OK)
	@ApiParam({
		name: 'username',
		type: 'string',
		description: 'User username',
		example: 'johndoe',
	})
	@ApiSuccessResponse(UserGameSummaryResponseDto)
	@ResponseEnvelope('User game summary retrieved successfully')
	async getUserSummary(
		@Param('username') username: string,
	): Promise<UserGameSummaryResponseDto> {
		return this.service.getUserSummary(username);
	}
}
