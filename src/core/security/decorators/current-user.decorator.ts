import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import {
	JwtAccessPayload,
	JwtRefreshPayload,
} from '../interfaces/jwt-payload.interface';

export const CurrentUser = createParamDecorator(
	(_, ctx: ExecutionContext): JwtAccessPayload => {
		const request = ctx.switchToHttp().getRequest<Request>();
		return request.user as JwtAccessPayload;
	},
);

export const CurrentUserRefresh = createParamDecorator(
	(_, ctx: ExecutionContext): JwtRefreshPayload => {
		const request = ctx.switchToHttp().getRequest<Request>();
		return request.user as JwtRefreshPayload;
	},
);
