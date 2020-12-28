import startServer from "../startServer";
import { AddressInfo } from "net";
import { Connection } from "typeorm";

interface CallbackType<T> {
	(args?: T): void;
}

export const setupInitialization = function JestGlobalSetupAlternative(
	callback: CallbackType<any>,
	beforeCb?: CallbackType<any>,
	afterCb?: CallbackType<any>
) {
	let connection: Connection | null = null;
	beforeAll(async () => {
		const { APP, CONN } = await startServer();
		const { port } = APP.address() as AddressInfo;
		process.env.TEST_HOST = `http://127.0.0.1:${port}`;
		connection = CONN;
		beforeCb?.();
	});

	callback();

	afterAll(async () => {
		afterCb?.();
		await connection?.close();
	});
};
