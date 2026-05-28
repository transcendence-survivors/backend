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

		const token = this.jwtService.signAsync({ sub: user.id });
		const hashtoken = hashToken(token);
	}

	async hashPassword(password: string) {
		return hash(password, this.salt);
	}

	async hashToken(token: string) {}
}
