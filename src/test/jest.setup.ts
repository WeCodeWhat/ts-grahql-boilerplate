import startServer from "../startServer";
import { AddressInfo } from "net";

interface CallbackType<T> {
	(args?: T): void;
}

export const setupInitialization = function JestGlobalSetupAlternative(
	callback: CallbackType<any>
) {
	beforeAll(async () => {
		const { APP } = await startServer();
		const { port } = APP.address() as AddressInfo;
		process.env.TEST_HOST = `http://127.0.0.1:${port}`;
	});

	callback();

	afterAll(() => {});
};
