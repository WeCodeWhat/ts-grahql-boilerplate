import { Redis } from "ioredis";

export interface Session {
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
		session: Session;
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
		session: Session;
	},
	info: any
) => any;

export interface IServer {
	schema: any;
	context: () => {
		redis: Redis;
		url: string;
		session: Session;
	};
}
