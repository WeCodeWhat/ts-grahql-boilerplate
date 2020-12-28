import * as Redis from "ioredis";

export const redis = new Redis({
	port: 6379, // Redis port
	host: "127.0.0.1", // Redis host
});
