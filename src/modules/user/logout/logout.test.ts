import * as faker from "faker";
import { User } from "../../../entity/User";
import { setupInitialization } from "../../../test/jest.setup";
import * as dotenv from "dotenv";
import { TestClient } from "../../../utils/TestClient";

dotenv.config();

const mockCredential = {
	email: faker.internet.email(),
	password: faker.internet.password(),
};

let userId: any = "";
let client_1: TestClient | null = null;
let client_2: TestClient | null = null;
setupInitialization(() => {
	beforeAll(async () => {
		client_1 = new TestClient(process.env.TEST_HOST as string);
		client_2 = new TestClient(process.env.TEST_HOST as string);
		const user = await User.create({
			...mockCredential,
			confirmed: true,
		}).save();
		userId = user.id;
	});
	describe("Logout", () => {
		describe("Multiple Session", () => {
			it("Same session data after log in", async () => {
				await client_1?.login(mockCredential.email, mockCredential.password);
				await client_2?.login(mockCredential.email, mockCredential.password);

				expect(await client_1?.me()).toEqual(await client_2?.me());
			});
			it("All session must be destroyed", async () => {
				await client_1?.logout();
				expect(await client_1?.me()).not.toEqual(await client_2?.me());
				await client_2?.logout();
				expect(await client_1?.me()).toEqual(await client_2?.me());
			});
		});
		describe("Single Session", () => {
			it("[NOT LOGGED IN] destroy the user session on logout", async () => {
				const res = (await client_1?.logout()).data;
				expect(res).toBeTruthy();
			});

			it("get current user", async () => {
				await client_1?.login(mockCredential.email, mockCredential.password);
				const response = (await client_1?.me()).data;
				expect(response.me).toEqual({
					id: userId,
					email: mockCredential.email,
				});
			});

			it("[LOGGED IN] destroy the user session on logout", async () => {
				const res = (await client_1?.logout()).data;
				expect(res).toBeTruthy();
			});
		});
	});
});
