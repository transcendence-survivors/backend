import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import CreateUserDto from '@/modules/user/dto/create.dto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	// @Post('login')
	// signIn(@Body() signInDto: ) {
	// 	return this.authService.
	// }

	@Post('register')
	signUp(@Body() signUpDto: CreateUserDto) {
		return this.authService.signUp(signUpDto);
	}
}
