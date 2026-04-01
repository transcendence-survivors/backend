import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { PrismaService } from '../../common/prisma.service';
import { PostsService } from '../post/post.service';
import { UserModule } from '../user/user.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		UserModule,
	],
	controllers: [AppController],
	providers: [PrismaService, PostsService],
})
export class AppModule {}
