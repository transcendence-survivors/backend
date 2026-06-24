import { JwtAccessPayload } from '@/modules/auth/token/strategies/access-token.strategy';
import { JwtRefreshPayloadParams } from '@/modules/auth/token/strategies/refresh-token.strategy';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
	(_, ctx: ExecutionContext): JwtAccessPayload => {
		const request = ctx.switchToHttp().getRequest<Request>();
		return request.user as JwtAccessPayload;
	},
);

export const CurrentUserRefresh = createParamDecorator(
	(_, ctx: ExecutionContext): JwtRefreshPayloadParams => {
		const request = ctx.switchToHttp().getRequest<Request>();
		return request.user as JwtRefreshPayloadParams;
	},
);
