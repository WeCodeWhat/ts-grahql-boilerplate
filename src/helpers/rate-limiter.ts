import * as RateLimit from "express-rate-limit";
import * as RateLimitRedisStore from "rate-limit-redis";
import { redis } from "./redis";

export const limiter = RateLimit({
	store: new RateLimitRedisStore({
		client: redis,
	}),
	window: 15 * 60 * 1000,
	max: 100,
	delayMs: 0,
});
