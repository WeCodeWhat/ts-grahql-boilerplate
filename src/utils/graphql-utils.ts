import { Session } from "express-session";
import { Redis } from "ioredis";

export interface SessionStorage extends Session {
	userId?: string;
}
export interface GQLResolverMap {
	[key: string]: {
		[key: string]: GQLResolverFunction;
	};
}

export type GQLResolverFunction = (
	parent: any,
	args: any,
	context: {
		redis: Redis;
		url: string;
		session: SessionStorage;
	},
	info: any
) => any;

export type GQLMiddlewareFunction = (
	resolver: GQLResolverFunction,
	parent: any,
	args: any,
	context: {
		redis: Redis;
		url: string;
		session: SessionStorage;
	},
	info: any
) => any;

export interface IServer {
	schema: any;
	context: () => {
		redis: Redis;
		url: string;
		session: SessionStorage;
	};
}
