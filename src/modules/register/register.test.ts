import { request as req } from "graphql-request";
import { User } from "../../entity/User";
import * as faker from "faker";
import { ErrorMessages } from "./errorMessage";
import { setupInitialization } from "../../test/jest.setup";

const email = faker.internet.email();
const password = faker.internet.password();

export const registerMutation = (e: string, p: string) => `
    mutation RegisterUser{
        register (email: "${e}", password: "${p}"){
			path
			message
		}
    }
`;

setupInitialization(() => {
	describe("Register user", () => {
		it("Register user to the database", async () => {
			const res = await req(
				process.env.TEST_HOST as string,
				registerMutation(email, password)
			);
			expect(res).toStrictEqual({ register: null });
			const users = await User.find({ where: { email } });
			expect(users).toHaveLength(1);
			const user = users?.[0];
			expect(user.email).toEqual(email);
			expect(user.password).not.toEqual(password);
		});
		describe("Validate the register input", () => {
			it("Check for the email length", async () => {
				expect(
					(
						await req(
							process.env.TEST_HOST as string,
							registerMutation("b", password)
						)
					).register
				).toEqual([
					{ message: ErrorMessages.emailNotLongEnough, path: "email" },
					{ message: ErrorMessages.invalidEmail, path: "email" },
				]);
			});

			it("Check for the password length", async () => {
				expect(
					(
						await req(
							process.env.TEST_HOST as string,
							registerMutation(faker.internet.email(), "1")
						)
					).register
				).toEqual([
					{ path: "password", message: ErrorMessages.passwordNotLongEnough },
				]);
			});

			it("Check for the email uniqueness", async () => {
				expect(
					(
						await req(
							process.env.TEST_HOST as string,
							registerMutation(email, password)
						)
					).register
				).toEqual([
					{
						path: "email",
						message: ErrorMessages.duplicateEmail,
					},
				]);
			});

			it("Check for the validation of email", async () => {
				expect(
					(
						await req(
							process.env.TEST_HOST as string,
							registerMutation("abc", password)
						)
					).register
				).toEqual([{ path: "email", message: ErrorMessages.invalidEmail }]);
			});
		});
	});
});
