import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { INestApplicationContext } from '@nestjs/common';
import { Env, ENV } from '@/core/config/env/providers/env.provider';
import { SocketAuthMiddleware } from '../middlewares/socket-auth.middleware';
import { type ClientSocket } from '@/core/websocket/interface/ws-socket.inteface';
import { WsServerProvider } from '../provider/ws-server.provider';

export class SocketIoAdapter extends IoAdapter {
	constructor(private readonly appContext: INestApplicationContext) {
		super(appContext);
	}

	createIOServer(port: number, options?: ServerOptions): Server {
		const env = this.appContext.get<Env>(ENV);
		const authMiddleware = this.appContext.get(SocketAuthMiddleware);

		const cors: ServerOptions['cors'] = {
			...options?.cors,
			origin: [env.frontEndUrl],
			credentials: true,
		};

		const server = super.createIOServer(port, {
			...options,
			cors,
		}) as Server;

		server.use((client: ClientSocket, next) => {
			authMiddleware.use(client, next);
		});
		this.appContext.get(WsServerProvider).set(server);
		return server;
	}
}
