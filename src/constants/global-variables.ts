import * as _env from "dotenv";

_env.config();

export const DEV_BASE_URL = `http://localhost:${process.env.SERVER_PORT}`;
