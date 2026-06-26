import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { INestApplicationContext } from '@nestjs/common';
import { Env, ENV } from '@/core/config/env/providers/env.provider';

export class SocketIoAdapter extends IoAdapter {
	constructor(private readonly appContext: INestApplicationContext) {
		super(appContext);
	}

	createIOServer(port: number, options?: ServerOptions): Server {
		const env = this.appContext.get<Env>(ENV);

		const cors: ServerOptions['cors'] = {
			...options?.cors,
			origin: [env.frontEndUrl],
			credentials: true,
		};

		return super.createIOServer(port, {
			...options,
			cors,
		}) as Server;
	}
}
