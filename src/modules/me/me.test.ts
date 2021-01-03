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
	describe("ME", () => {
		test("can't get user if not logged in", async () => {
			try {
				const response = (await client?.me()).data;
				expect(response.me).toBeNull();
			} catch (error) {
				expect(error.message).toEqual("no cookie");
			}
		});
		test("get current user", async () => {
			await client?.login(mockCredential.email, mockCredential.password);

			const response = (await client?.me()).data;
			console.log(response);
			expect(response.me).toEqual({
				id: userId,
				email: mockCredential.email,
			});
		});
	});
});
