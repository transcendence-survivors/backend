import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('login')
	signIn(@Body() signInDto: ) {
		return this.authService.
	}

	@Post('register')
	signUp(@Body() signUpDto: ) {
		return this.authService.
	}
}
