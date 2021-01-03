import { User } from "../../entity/User";
import * as faker from "faker";
import { ErrorMessages } from "./errorMessage";
import { setupInitialization } from "../../test/jest.setup";
import * as dotenv from "dotenv";
import { TestClient } from "../../utils/TestClient";

dotenv.config();

const email = faker.internet.email();
const password = faker.internet.password();

let client: TestClient | null = null;
setupInitialization(() => {
	beforeAll(() => (client = new TestClient(process.env.TEST_HOST as string)));
	describe("Register user", () => {
		it("Register user to the database", async () => {
			const res = await client?.register(email, password);
			expect(res.data).toStrictEqual({ register: null });
			const users = await User.find({ where: { email } });
			expect(users).toHaveLength(1);
			const user = users?.[0];
			expect(user.email).toEqual(email);
			expect(user.password).not.toEqual(password);
		});
		describe("Validate the register input", () => {
			it("Check for the email length", async () => {
				expect((await client?.register("b", password)).data.register).toEqual([
					{ message: ErrorMessages.emailNotLongEnough, path: "email" },
					{ message: ErrorMessages.invalidEmail, path: "email" },
				]);
			});

			it("Check for the password length", async () => {
				expect(
					(await client?.register(faker.internet.email(), "1")).data.register
				).toEqual([
					{ path: "password", message: ErrorMessages.passwordNotLongEnough },
				]);
			});

			it("Check for the email uniqueness", async () => {
				expect((await client?.register(email, password)).data.register).toEqual(
					[
						{
							path: "email",
							message: ErrorMessages.duplicateEmail,
						},
					]
				);
			});

			it("Check for the validation of email", async () => {
				expect(
					(await client?.register("abc", password)).data.register
				).toEqual([{ path: "email", message: ErrorMessages.invalidEmail }]);
			});
		});
	});
});
