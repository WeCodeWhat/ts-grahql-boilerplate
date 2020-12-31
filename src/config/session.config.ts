import * as session from "express-session";
import { initializeRedisStore } from "../helpers/redis";
import { EnvironmentType } from "../utils/environment";

export const sessionConfiguration = session({
	name: "qid",
	secret: "s3ssion-s3cret",
	resave: false,
	saveUninitialized: false,
	store: initializeRedisStore(session),
	cookie: {
		httpOnly: true,
		secure: process.env.NODE_ENV === EnvironmentType.PROD,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
});
