import * as Redis from "ioredis";
import * as connectRedis from "connect-redis";

export const initializeRedisStore = (session: any) => {
	const RedisStore = connectRedis(session);

	return new RedisStore({ client: Redis as any });
};

export const redis = new Redis({
	port: 6379, // Redis port
	host: "127.0.0.1", // Redis host
});
