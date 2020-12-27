import { request as req } from "graphql-request";
// import { startServer } from "..";
import * as faker from "faker";
import { User } from "../entity/User";
import { Connection } from "typeorm";
import startServer from "../startServer";
import { AddressInfo } from "net";

let getHost = () => "";

let conn: Connection | null = null;
beforeAll(async () => {
	const { APP, CONN } = await startServer();
	const { port } = APP.address() as Pick<AddressInfo, "port">;
	conn = CONN;
	getHost = () => `http://127.0.0.1:${port}`;
});

const email = faker.internet.email();
const password = faker.internet.password();

const mutation = `
    mutation RegisterUser{
        register (email: "${email}", password: "${password}")
    }
`;

test("Register user", async () => {
	const res = await req(getHost(), mutation);
	expect(res).toStrictEqual({ register: true });
	const users = await User.find({ where: { email } });
	expect(users).toHaveLength(1);
	const user = users?.[0];
	expect(user.email).toEqual(email);
	expect(user.password).not.toEqual(password);
});

afterAll(async () => await conn?.close());
