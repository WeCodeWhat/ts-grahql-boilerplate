import "reflect-metadata";
import * as dotenv from "dotenv";
import startServer from "./startServer";
import { debug } from "./utils/debug";

dotenv.config();

debug(true);
startServer();
