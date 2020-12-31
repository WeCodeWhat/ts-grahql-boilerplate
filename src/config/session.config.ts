import * as session from "express-session";
import { EnvironmentType } from "../utils/environment";

export const sessionConfiguration = session({
	name: "qid",
	secret: process.env.SESSION_SECRET as string,
	resave: false,
	saveUninitialized: false,
	cookie: {
		httpOnly: true,
		secure: process.env.NODE_ENV === EnvironmentType.PROD,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
});
