import startServer from "../startServer";
import { AddressInfo } from "net";
import { getConnection } from "typeorm";
interface CallbackType<T> {
	(args?: T): void;
}

const TIMEOUT = 10000;

export const setupInitialization = function JestGlobalSetupAlternative(
	callback: CallbackType<any>
) {
	beforeAll(async () => {
		const { APP } = await startServer();
		const { port } = APP.address() as AddressInfo;
		process.env.TEST_HOST = `http://127.0.0.1:${port}`;
	}, TIMEOUT);

	callback();

	afterAll(async () => {
		await getConnection().close();
	});
};
