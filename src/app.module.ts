import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';
import { UsersService } from './user.service';
import { PostsService } from './post.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
	],
	controllers: [AppController],
	providers: [PrismaService, UsersService, PostsService],
})
export class AppModule {}
