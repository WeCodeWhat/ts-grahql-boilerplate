import "reflect-metadata";
import "dotenv/config";
import startServer from "./startServer";
import { debug } from "./utils/debug";

debug(true);
startServer();
