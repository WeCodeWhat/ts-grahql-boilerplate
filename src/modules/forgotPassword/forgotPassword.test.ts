import { setupInitialization } from "../../test/jest.setup";
import * as dotenv from "dotenv";
import { TestClient } from "../../utils/TestClient";
import { User } from "../../entity/User";
import * as faker from "faker";
import { createForgotPasswordLink } from "../../services/emailService";
import { redis } from "../../helpers/redis";
import { ErrorMessages } from "../login/errorMessage";
import { forgotPasswordLockAccount } from "../../utils/forgotPasswordLockAccount";
import { ErrorMessage } from "./ErrorMessage";
import { ErrorMessages as LoginErrorMessage } from "../login/errorMessage";

dotenv.config();

const mockCredential = {
	email: faker.internet.email(),
	password: "123456789a",
	newPassword: "987654321a",
};
let user: User | null = null;
let client: TestClient | null = null;
setupInitialization(() => {
	beforeAll(async () => {
		client = new TestClient(process.env.TEST_HOST as string);
		user = await User.create({ ...mockCredential, confirmed: true }).save();
	});
	describe("Forgot Password", () => {
		test("Email is sent to user", async () => {
			const {
				data: { sendForgotPasswordEmail },
			} = await client?.sendForgotPasswordEmail(user?.email as string);
			expect(sendForgotPasswordEmail).toBeNull();
		});
		test("Email is not exist", async () => {
			const {
				data: { sendForgotPasswordEmail },
			} = await client?.sendForgotPasswordEmail("192891");
			expect(sendForgotPasswordEmail).toEqual([
				{
					path: "email",
					message: ErrorMessage.userIsNotExist,
				},
			]);
		});
		test("Account must be locked", async () => {
			const res = (
				await client?.login(mockCredential.email, mockCredential.password)
			).data;
			expect(res.login).toEqual({
				message: LoginErrorMessage.forgotPasswordLock,
				path: "email",
			});
		});
		test("Make sure it works", async () => {
			//lock account on forget password
			await forgotPasswordLockAccount(user?.id as string, redis);
			const link = await createForgotPasswordLink(
				"",
				user?.id as string,
				redis
			);
			const parts = link.split("/");
			const key = parts[parts.length - 1];
			const res = (
				await client?.forgotPasswordChange(mockCredential.newPassword, key)
			).data;
			expect(res.forgotPasswordChange).toBeNull();
		});

		test("Login with new password", async () => {
			const res = (
				await client?.login(mockCredential.email, mockCredential.newPassword)
			).data;
			expect(res.login).toBeNull();
		});
		test("Login with old password", async () => {
			const res = (
				await client?.login(mockCredential.email, mockCredential.password)
			).data;
			expect(res.login).toEqual({
				message: ErrorMessages.defaultMessage,
				path: "email",
			});
		});
		test("Login with invalid password", async () => {
			const res = (await client?.login(mockCredential.email, "1")).data;
			expect(res.login).toEqual({
				message: ErrorMessages.defaultMessage,
				path: "email",
			});
		});
	});
});
