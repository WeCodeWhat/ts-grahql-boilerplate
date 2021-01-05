import { ErrorMessages } from "./errorMessage";
import { setupInitialization } from "../../../test/jest.setup";
import * as faker from "faker";
import { User } from "../../../entity/User";
import * as dotenv from "dotenv";
import { TestClient } from "../../../utils/TestClient";
// import { createConfirmedEmailLink } from "../../services/emailService";
// import { redis } from "../../helpers/redis";
// import fetch from "node-fetch";

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
		await client.register(mockCredential.email, mockCredential.password);
		user = (await User.find({ where: { email: mockCredential.email } }))[0];
		user.confirmed = false;
	});
	describe("Authenticate the login progress", () => {
		it("Catch error with wrong credentials", async () => {
			const res = await client?.login("1231dsfasda21@email.com", "asd123dafa");
			expect(res.data.login).toEqual(defaultMessage);
		});
		it("Yup validate email input", async () => {
			const res = await client?.login("1231", "asd123dafa");
			expect(res.data.login).toEqual(defaultMessage);
		});
		it("Valid email but wrong password", async () => {
			const res = await client?.login(
				(user as User)?.email,
				mockCredential.password + "12312412"
			);
			expect(res.data.login).toEqual(defaultMessage);
		});
		it("Not verify email yet", async () => {
			const res = await client?.login(
				(user as User)?.email,
				mockCredential.password
			);
			expect(res.data.login).toEqual({
				message: ErrorMessages.emailIsNotConfirmed,
				path: "email",
			});
		});
		// it("A valid account with verified email", async () => {
		// 	const confirmedLink = await createConfirmedEmailLink(
		// 		process.env.TEST_HOST as string,
		// 		user?.id as string,
		// 		redis
		// 	);
		// 	console.log(confirmedLink);
		// 	const resEmail = await fetch(confirmedLink);
		// 	expect(await resEmail.text()).toEqual("ok");

		// 	const res = await client?.login(
		// 		(user as User)?.email,
		// 		mockCredential.password
		// 	);
		// 	expect(res.data.login).toBeNull();
		// });
	});
});
