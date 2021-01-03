import startServer from "../startServer";
import { AddressInfo } from "net";
import * as dotenv from "dotenv";

dotenv.config();
interface CallbackType<T> {
	(args?: T): void;
}

const TIMEOUT = 10000;

let conn: any = "";
export const setupInitialization = function JestGlobalSetupAlternative(
	callback: CallbackType<any>
) {
	beforeAll(async () => {
		const { CONN, APP } = await startServer();
		const { port } = APP.address() as AddressInfo;
		process.env.TEST_HOST = `http://127.0.0.1:${port}`;

		conn = CONN;
	}, TIMEOUT);

	callback();

	afterAll(async () => {
		await conn.close();
	});
};
