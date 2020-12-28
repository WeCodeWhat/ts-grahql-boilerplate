import { User } from "../entity/User";
import { createConfirmedEmailLink } from "./emailService";
import fetch from "node-fetch";
import * as faker from "faker";
import { redis } from "../helpers/redis";
import { setupInitialization } from "../test/jest.setup";

let userId: string = "";
let link: string = "";

setupInitialization(async () => {
	beforeAll(async () => {
		const user = await User.create({
			email: faker.internet.email(),
			password: faker.internet.password(),
		}).save();
		userId = user.id;

		link = await createConfirmedEmailLink(
			process.env.TEST_HOST as string,
			userId,
			redis
		);
	});

	describe("", () => {});

	describe("Make sure createConfirmationLink works and Redis delete the key", () => {
		it("Response status is 200", async () => {
			const res = await fetch(link);
			expect(res.status).toBe(200);
			const text = await res.text();
			expect(text).toEqual("ok");
		});
		it("Confirm field is true", async () => {
			const user = await User.findOne({ where: { id: userId } });
			expect(user?.confirmed).toBeTruthy();
		});
		it("Send invalid status code if bad id sent", async () => {
			const res = await fetch(
				`${process.env.TEST_HOST as string}/confirm/1234`
			);
			expect(await res.text()).toEqual("invalid");
		});
		it("Redis delete the id key", async () => {
			const chunks = link.split("/");
			const key = chunks[chunks.length - 1];
			expect(await redis.get(key)).toBeNull();
		});
	});
});
