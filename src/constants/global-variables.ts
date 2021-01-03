import * as _env from "dotenv";

_env.config();

export const DEV_BASE_URL = `http://localhost:${process.env.SERVER_PORT}`;

export const REDIS_SESSION_PREFIX = "sess: ";
export const USER_SESSION_ID_PREFIX = "userSid :";
