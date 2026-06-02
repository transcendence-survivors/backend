import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma-generated/enums';

interface AuthorizationParams {
	current: UserRole;
	required: UserRole;
}

@Injectable()
export class RoleService {
	private hierarchy: Map<string, number>;

	constructor() {
		this.hierarchy = this.buildHierarchy([
			UserRole.USER,
			UserRole.ADMIN,
			UserRole.SUPER_ADMIN,
		]);
	}

	private buildHierarchy(roles: UserRole[]) {
		let priority = 1;
		const hierarchy: Map<string, number> = new Map();
		roles.forEach((role) => {
			hierarchy.set(role, priority);
			priority++;
		});
		return hierarchy;
	}

	isAuthorized({ current, required }: AuthorizationParams) {
		const priority = this.hierarchy.get(current);
		const requiredPriority = this.hierarchy.get(required);

		if (priority && requiredPriority && priority >= requiredPriority)
			return true;
		return false;
	}
}
