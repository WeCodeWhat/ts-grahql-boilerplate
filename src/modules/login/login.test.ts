import { ErrorMessages } from "./errorMessage";
import { setupInitialization } from "../../test/jest.setup";
import * as faker from "faker";
import { User } from "../../entity/User";
import * as dotenv from "dotenv";
import { TestClient } from "../../utils/TestClient";

dotenv.config();

const defaultMessage = {
	path: "email",
	message: ErrorMessages.defaultMessage,
};
const mockCredential = {
	email: faker.internet.email(),
	password: faker.internet.password(),
};

let user: User | null = null;
let client: TestClient | null = null;
setupInitialization(() => {
	beforeAll(async () => {
		client = new TestClient(process.env.TEST_HOST as string);
		console.log(client);
		await client.register(mockCredential.email, mockCredential.password);
		user = (await User.find({ where: { email: mockCredential.email } }))[0];
		user.confirmed = false;
	});
	describe("Authenticate the login progress", () => {
		it("Catch error with wrong credentials", async () => {
			const res = await client?.login("1231dsfasda21@email.com", "asd123dafa");
			console.log(res);
			expect(res.data.login).toEqual(defaultMessage);
		});
		it("Yup validate email input", async () => {
			const res = await client?.login("1231", "asd123dafa");
			expect(res.data.login).toEqual(defaultMessage);
		});
		it("Authenticate a valid email", async () => {
			const res = await client?.login(
				(user as User)?.email,
				(user as User)?.password + "12312412"
			);
			expect(res.data.login).toBeNull();
		});
	});
});
