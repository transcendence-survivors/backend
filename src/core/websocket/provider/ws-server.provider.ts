import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class WsServerProvider {
	private server!: Server;

	set(server: Server) {
		this.server = server;
	}

	get(): Server {
		return this.server;
	}
}
