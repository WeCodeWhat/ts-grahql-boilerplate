import * as Redis from "ioredis";
import * as connectRedis from "connect-redis";

export const redis = new Redis({
	port: 6379, // Redis port
	host: "127.0.0.1", // Redis host
});

export const initializeRedisStore = (session: any): connectRedis.RedisStore => {
	const RedisStore = connectRedis(session);

	return new RedisStore({ client: redis });
};
