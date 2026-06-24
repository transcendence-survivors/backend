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
import { BaseController } from '@/shared/base.controller';

@Controller('blocks')
@UseGuards(JWTAccessGuard)
export class BlockController extends BaseController {
	constructor(private readonly service: BlockService) {
		super();
	}

	@HttpCode(200)
	@Get()
	async getAll(
		@CurrentUser() { sub }: JwtAccessPayload,
		@Query() query: BlockQueryDto,
	) {
		const result = await this.service.findPage(sub, query);
		return this.ok(result, 'Successfully retrieved blocked users');
	}

	@HttpCode(201)
	@Post()
	async add(
		@CurrentUser() { sub }: JwtAccessPayload,
		@Body() body: BlockAddDto,
	) {
		const result = await this.service.create(sub, body.blockedUserId);
		return this.ok(result, 'User blocked successfully');
	}

	@HttpCode(204)
	@Delete(':blockedUserId')
	async delete(
		@CurrentUser() { sub }: JwtAccessPayload,
		@Param('blockedUserId') blockedUserId: string,
	) {
		await this.service.remove(sub, blockedUserId);
	}
}
