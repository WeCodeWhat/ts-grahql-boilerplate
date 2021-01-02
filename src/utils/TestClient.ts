import * as rp from "request-promise";
import { loginMutation } from "../modules/login/login.test";

export class TestClient {
	url: string;
	options: {
		jar: any;
		json: boolean;
		withCredentials: boolean;
	};
	constructor(url: string) {
		this.url = url;
		this.options = {
			jar: rp.jar(),
			json: true,
			withCredentials: true,
		};
	}

	async login(email: string, password: string) {
		return rp.post("", {
			...this.options,
			body: loginMutation(email, password),
		});
	}
}
