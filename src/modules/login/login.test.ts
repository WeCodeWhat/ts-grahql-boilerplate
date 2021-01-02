import { request as req } from "graphql-request";
import { ErrorMessages } from "./errorMessage";
import { setupInitialization } from "../../test/jest.setup";
import { registerMutation } from "../register/register.test";
import * as faker from "faker";
import { User } from "../../entity/User";

export const loginMutation = (e: string, p: string) => `
    mutation LoginUser{
        login (email: "${e}", password: "${p}"){
			path
			message
		}
    }`;

const defaultMessage = {
	path: "email",
	message: ErrorMessages.defaultMessage,
};
const mockCredential = {
	email: faker.internet.email(),
	password: faker.internet.password(),
};

let user: User | null = null;
setupInitialization(() => {
	beforeAll(async () => {
		await req(
			process.env.TEST_HOST as string,
			registerMutation(mockCredential.email, mockCredential.password)
		);
		user = (await User.find({ where: { email: mockCredential.email } }))[0];
		user.confirmed = false;
	});
	describe("Authenticate the login progress", () => {
		it("Catch error with wrong credentials", async () => {
			const res = await req(
				process.env.TEST_HOST as string,
				loginMutation("1231dsfasda21@email.com", "asd123dafa")
			);
			expect(res.login).toEqual(defaultMessage);
		});
		it("Yup validate email input", async () => {
			const res = await req(
				process.env.TEST_HOST as string,
				loginMutation("1231", "asd123dafa")
			);
			expect(res.login).toEqual(defaultMessage);
		});
		it("Authenticate a valid email", async () => {
			const res = await req(
				process.env.TEST_HOST as string,
				loginMutation(
					(user as User)?.email,
					(user as User)?.password + "12312412"
				)
			);
			expect(res.login).toBeNull();
		});
	});
});
