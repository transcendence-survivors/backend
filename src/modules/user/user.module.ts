import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { USER_SERVICE } from '@/contracts/services/user/user-service.port';
import { UserMapper } from './mappers/user.mapper';

@Module({
	controllers: [UserController],
	providers: [
		UserService,
		UserRepository,
		UserMapper,
		{
			provide: USER_SERVICE,
			useExisting: UserService,
		},
	],
	exports: [USER_SERVICE],
})
export class UserModule {}
