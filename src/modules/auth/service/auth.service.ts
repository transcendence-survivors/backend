import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../repository/token.repository';
import { JwtService } from '@nestjs/jwt';
import { hash, compare, genSalt, hashSync } from 'bcrypt';
import CreateUserDto from '@/modules/user/dto/create.dto';
import { UserService } from '@/modules/user/service/user.service';

@Injectable()
export class AuthService {
	private salt: number = 10;

	constructor(
		private repo: AuthRepository,
		private jwtService: JwtService,
		private userService: UserService,
	) {}

	// async signIn(signInDto: LoginDto) {}

	async signUp({ password, ...userData }: CreateUserDto) {
		const user = await this.userService.create(userData);

		const payload = { sub: user.id, username: user.username };
		return this.jwtService.signAsync(payload);
	}

	async hashPassword(password: string) {
		return hashSync(password, this.salt);
	}
}
