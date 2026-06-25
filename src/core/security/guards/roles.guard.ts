import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma-generated/enums';
import { ROLE_KEY } from '@/core/security/decorators/role.decorator';
import { Request } from 'express';
import { JwtAccessPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private roleService: RoleService,
		private reflector: Reflector,
	) {}

	canActivate(context: ExecutionContext) {
		const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
			ROLE_KEY,
			[context.getHandler(), context.getClass()],
		);
		const request = context.switchToHttp().getRequest<Request>();
		const { role: tokenRole } = request.user as JwtAccessPayload;

		for (const role of requiredRoles) {
			const isValid = this.roleService.isAuthorized({
				required: role,
				current: tokenRole,
			});
			if (isValid) return true;
		}
		return false;
	}
}
