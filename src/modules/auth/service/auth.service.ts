import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../repository/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { hash, compare, genSalt } from 'bcrypt';

@Injectable()
export class AuthService {
	salt: number = 10;
	constructor(
		private repo: AuthRepository,
		private jwtService: JwtService,
		private userService: UserService,
	) {}

	signIn(signInDto: LoginDto) {}

	signUp(signUpDto: RegisterDto) {
		//Call User Service for User Creation
		const user = userService.createUser(signUpDto);

		const payload = { sub: user.userId, username: user.username };
		return this.jwtService.sign(payload);
	}

	hashPassword(password: string) {
		return hash(password, this.salt);
	}
}
