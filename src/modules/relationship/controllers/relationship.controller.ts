import { JWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	UseGuards,
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { ApiSuccessResponse } from '@/shared/decorators/api-success-response.decorator';
import { CurrentUser } from '@/core/security/decorators/current-user.decorator';
import { type JwtAccessPayload } from '@/core/security/interfaces/jwt-payload.interface';
import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';
import { RelationshipService } from '../services/relationship.service';
import { RelationshipStatusResponseDto } from '../dtos/responses/relationship-status-response.dto';

@UseGuards(JWTAccessGuard)
@Controller('relationships')
export class RelationshipController {
	constructor(private readonly service: RelationshipService) {}

	@Get(':username')
	@HttpCode(HttpStatus.OK)
	@ApiParam({
		name: 'userName',
		description: 'The username of the target user',
		example: 'JohnDoe',
	})
	@ApiSuccessResponse(RelationshipStatusResponseDto)
	@ResponseEnvelope('Relationship status retrieved successfully')
	getStatus(
		@CurrentUser() user: JwtAccessPayload,
		@Param('username') username: string,
	): Promise<RelationshipStatusResponseDto> {
		return this.service.getStatus(user.sub, username);
	}
}
