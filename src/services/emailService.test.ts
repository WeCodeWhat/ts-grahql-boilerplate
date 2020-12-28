import { User } from "../entity/User";
import { createConfirmedEmailLink } from "./emailService";
import fetch from "node-fetch";
import * as faker from "faker";
import * as Redis from "ioredis";
import { setupInitialization } from "../test/jest.setup";

let userId: string = "";

setupInitialization(() => {
	beforeAll(async () => {
		const user = await User.create({
			email: faker.internet.email(),
			password: faker.internet.password(),
		}).save();
		userId = user.id;
	});

	describe("Confirmation Email Link", () => {
		it("Response status is 200", async () => {
			const redis = new Redis();
			const link = await createConfirmedEmailLink(
				process.env.TEST_HOST as string,
				userId,
				redis
			);
			const res = await fetch(link);
			expect(res.status).toBe(200);
		});
	});
});
