import { request as req } from "graphql-request";
// import { startServer } from "..";
import { DEV_BASE_URL } from "../constants/global-variables";
import * as faker from "faker";
import { User } from "../entity/User";
import { createTypeormConn } from "../helpers/orm";
import { Connection } from "typeorm";

const email = faker.internet.email();
const password = faker.internet.password();

const mutation = `
    mutation RegisterUser{
        register (email: "${email}", password: "${password}")
    }
`;
let connection: Connection | null = null;
beforeAll(async () => {
	connection = await createTypeormConn();
});

test("Register user", async () => {
	const res = await req(DEV_BASE_URL, mutation);
	expect(res).toBe({ register: true });
	const users = connection
		?.getRepository(User)
		.createQueryBuilder("users")
		.where("user.email = :email", { email });
	const user = await users?.getOne();
	expect(users?.getCount()).toBe(1);
	expect(user?.email).toEqual(email);
	expect(user?.password).not.toEqual(password);
});

afterAll(async () => {
	connection?.close();
});
