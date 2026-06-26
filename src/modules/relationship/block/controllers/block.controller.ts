import { JWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { BlockAddDto } from '../dto/block-add.dto';
import { CurrentUser } from '@/core/security/decorators/current-user.decorator';
import type { JwtAccessPayload } from '@/core/security/interfaces/jwt-payload.interface';
import { BlockService } from '../services/block.service';
import { BlockQueryDto } from '../dto/blocker-query.dto';
import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';

@Controller('blocks')
@UseGuards(JWTAccessGuard)
export class BlockController {
	constructor(private readonly service: BlockService) {}

	@Get()
	@HttpCode(200)
	@ResponseEnvelope('Successfully retrieved blocked users')
	getAll(
		@CurrentUser() { sub }: JwtAccessPayload,
		@Query() query: BlockQueryDto,
	) {
		return this.service.findPage(sub, query);
	}

	@Post()
	@HttpCode(201)
	@ResponseEnvelope('User blocked successfully')
	async add(
		@CurrentUser() { sub }: JwtAccessPayload,
		@Body() body: BlockAddDto,
	) {
		return this.service.create(sub, body.blockedUserId);
	}

	@Delete(':blockedUserId')
	@HttpCode(204)
	async delete(
		@CurrentUser() { sub }: JwtAccessPayload,
		@Param('blockedUserId') blockedUserId: string,
	) {
		await this.service.remove(sub, blockedUserId);
	}
}
