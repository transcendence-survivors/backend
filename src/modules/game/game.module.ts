import { Module } from '@nestjs/common';
import { GameController } from './controllers/game.controller';
import { GameService } from './services/game.service';
import { GameRepository } from './repositories/game.repository';
import { UserModule } from '../user/user.module';
import { GameListener } from './listeners/game.listener';
import { GameMapper } from './mappers/game.mapper';

@Module({
	imports: [UserModule],
	controllers: [GameController],
	providers: [GameService, GameRepository, GameListener, GameMapper],
})
export class GameModule {}
