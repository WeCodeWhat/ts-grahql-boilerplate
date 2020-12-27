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

test("Email uniqueness", async () => {
	// [Test] email uniqueness
	const res2: any = await req(getHost(), mutation(email, password));
	expect(res2.register).toHaveLength(1);
	expect(res2.register[0].path).toEqual("email");
	expect(res2.register[0].message).toEqual(ErrorMessages.duplicateEmail);
});

test("Register input validation", async () => {
	// [Test] validation
	const res3: any = await req(getHost(), mutation("b", password));
	expect(res3.register).toHaveLength(2);
	expect(res3.register[0].path).toEqual("email");
	expect(res3.register[1].message).toEqual(ErrorMessages.invalidEmail);
	expect(res3.register[0].message).toEqual(ErrorMessages.emailNotLongEnough);

	const res4: any = await req(getHost(), mutation("abc", password));
	expect(res4.register).toHaveLength(1);
	expect(res4.register[0].path).toEqual("email");
	expect(res4.register[0].message).toEqual(ErrorMessages.invalidEmail);
});

afterAll(async () => await conn?.close());
