import { request as req } from "graphql-request";
import { User } from "../../entity/User";
import { Connection } from "typeorm";
import startServer from "../../startServer";
import { AddressInfo } from "net";
import * as faker from "faker";
import { ErrorMessages } from "./errorMessage";

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

const mutation = (e: string, p: string) => `
    mutation RegisterUser{
        register (email: "${e}", password: "${p}"){
			path
			message
		}
    }
`;

test("Register user", async () => {
	const res = await req(getHost(), mutation(email, password));
	expect(res).toStrictEqual({ register: null });
	const users = await User.find({ where: { email } });
	expect(users).toHaveLength(1);
	const user = users?.[0];
	expect(user.email).toEqual(email);
	expect(user.password).not.toEqual(password);
});

test("Email length", async () => {
	expect((await req(getHost(), mutation("b", password))).register).toEqual([
		{ message: ErrorMessages.emailNotLongEnough, path: "email" },
		{ message: ErrorMessages.invalidEmail, path: "email" },
	]);
});

test("Password length", async () => {
	expect(
		(await req(getHost(), mutation(faker.internet.email(), "1"))).register
	).toEqual([
		{ path: "password", message: ErrorMessages.passwordNotLongEnough },
	]);
});

test("Email uniqueness", async () => {
	expect((await req(getHost(), mutation(email, password))).register).toEqual([
		{
			path: "email",
			message: ErrorMessages.duplicateEmail,
		},
	]);
});

test("Email valid", async () => {
	expect((await req(getHost(), mutation("abc", password))).register).toEqual([
		{ path: "email", message: ErrorMessages.invalidEmail },
	]);
});

afterAll(async () => await conn?.close());
