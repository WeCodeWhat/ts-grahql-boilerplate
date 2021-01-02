import * as faker from "faker";
import { request as req } from "graphql-request";
import axios from "axios";
import { User } from "../../entity/User";
import { setupInitialization } from "../../test/jest.setup";
import * as dotenv from "dotenv";

dotenv.config();

const loginMutation = (e: string, p: string) => `
    mutation LoginUser{
        login (email: "${e}", password: "${p}"){
			path
			message
		}
    }
`;

const meQuery = `
	query GetMe{
		me {
			id
			email
		}
	}
`;

const logoutMutation = `
mutation LogoutUser{
    logout
}`;

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
	describe("Logout", () => {
		it("get current user", async () => {
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
		it("destroy the user session on logout", async () => {
			const res = await req(process.env.TEST_HOST as string, logoutMutation);

			expect(res).toBeTruthy();
		});
	});
});
