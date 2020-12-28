import { User } from "../entity/User";
import { createConfirmedEmailLink } from "./emailService";
import fetch from "node-fetch";
import * as faker from "faker";
import * as Redis from "ioredis";
import { setupInitialization } from "../test/jest.setup";

let userId: string = "";
let link: string = "";
const redis = new Redis();

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

	describe("Confirmation Email Link", () => {
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
		it("Redis store user id", async () => {
			const chunks = link.split("/");
			const key = chunks[chunks.length - 1];
			expect(await redis.get(key)).toBeNull();
		});
	});
});
