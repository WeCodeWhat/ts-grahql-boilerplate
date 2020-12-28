import fetch from "node-fetch";
import { setupInitialization } from "../test/jest.setup";

setupInitialization(async () => {
	test("Send invalid status code if bad id sent", async () => {
		const res = await fetch(`${process.env.TEST_HOST as string}/confirm/1234`);
		expect(await res.text()).toEqual("invalid");
	});
});
