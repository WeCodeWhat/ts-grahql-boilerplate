import * as faker from "faker";
import axios from "axios";
import { User } from "../../entity/User";
import { setupInitialization } from "../../test/jest.setup";
import * as dotenv from "dotenv";
import { loginMutation } from "../login/login.test";

dotenv.config();

export const meQuery = `
	query GetMe{
		me {
			id
			email
		}
	}
`;

const mockCredential = {
	email: faker.internet.email(),
	password: faker.internet.password(),
};

let userId: any = "";
setupInitialization(() => {
	beforeAll(async () => {
		const user = await User.create({
			...mockCredential,
			confirmed: true,
		}).save();
		userId = user.id;
	});
	describe("ME", () => {
		test("can't get user if not logged in", async () => {
			const response = (
				await axios.post(process.env.TEST_HOST as string, {
					query: meQuery,
				})
			).data;
			expect(response.data.me).toBeNull();
		});
		test("get current user", async () => {
			await axios.post(
				process.env.TEST_HOST as string,
				{
					query: loginMutation(mockCredential.email, mockCredential.password),
				},
				{
					withCredentials: true,
				}
			);

			const response = (
				await axios.post(
					process.env.TEST_HOST as string,
					{
						query: meQuery,
					},
					{
						withCredentials: true,
					}
				)
			).data;
			expect(response.data.me).toEqual({
				id: userId,
				email: mockCredential.email,
			});
		});
	});
});
