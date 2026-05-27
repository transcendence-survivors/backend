import {
	Controller,
	Get,
	Post,
	Param,
	Put,
	Delete,
	Body,
	Query,
	Patch,
} from '@nestjs/common';
import { PlayerService } from './player.service';
import {
	CreatePlayerDto,
	EditPlayerDto,
	PaginationDto,
} from './dto/player.dto';

@Controller('player')
export class PlayerController {
	constructor(private service: PlayerService) {}

	@Get()
	getPlayers(@Query() query: PaginationDto) {
		return this.service.getPlayers({ page: query.page, size: query.size });
	}

	@Get(':id')
	getPlayerById(@Param('id') username: string) {
		return this.service.getPlayerByUsername(username);
	}

	@Post()
	createPlayer(@Body() dto: CreatePlayerDto) {
		return this.service.createPlayer(dto.name);
	}

	@Patch(':id')
	editPlayer(@Param('id') id: string, @Body() query: EditPlayerDto) {
		return this.service.editPlayer(id, query);
	}

	@Delete(':id')
	deletePlayer(@Param('id') id: string) {
		return this.service.deletePlayer(id);
	}
}
