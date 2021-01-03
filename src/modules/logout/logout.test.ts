import * as faker from "faker";
import { User } from "../../entity/User";
import { setupInitialization } from "../../test/jest.setup";
import * as dotenv from "dotenv";
import { TestClient } from "../../utils/TestClient";

dotenv.config();

const mockCredential = {
	email: faker.internet.email(),
	password: faker.internet.password(),
};

let userId: any = "";
let client: TestClient | null = null;
setupInitialization(() => {
	beforeAll(async () => {
		client = new TestClient(process.env.TEST_HOST as string);
		const user = await User.create({
			...mockCredential,
			confirmed: true,
		}).save();
		userId = user.id;
	});
	describe("Logout", () => {
		it("[NOT LOGGED IN] destroy the user session on logout", async () => {
			const res = (await client?.logout()).data;
			expect(res).toBeTruthy();
		});

		it("get current user", async () => {
			await client?.login(mockCredential.email, mockCredential.password);
			const response = (await client?.me()).data;
			expect(response.data.me).toEqual({
				id: userId,
				email: mockCredential.email,
			});
		});

		it("[LOGGED IN] destroy the user session on logout", async () => {
			const res = (await client?.logout()).data;
			expect(res).toBeTruthy();
		});
	});
});
