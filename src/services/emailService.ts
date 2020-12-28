import { v4 } from "uuid";
import * as Redis from "ioredis";

export const createConfirmedEmailLink = async (
	url: string,
	userId: string,
	redis: Redis.Redis
) => {
	const id = v4();
	await redis.set(id, userId, "EX", 60 * 60 * 24);
	return `${url}/confirm/${id}`;
};
