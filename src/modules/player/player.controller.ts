import { Controller, Get } from '@nestjs/common'
import { PlayerService } from './player.service'

@Controller('player')
export class PlayerController {

	@Get()
	getPlayer(): any {
		return [{id: 0}];
	}
}