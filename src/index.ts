import startServer from "./startServer";
import { debug } from "./utils/debug";
import * as dotenv from "dotenv";

dotenv.config();

debug(true);
startServer();
