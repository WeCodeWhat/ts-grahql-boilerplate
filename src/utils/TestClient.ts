import * as rp from "request-promise";
import { gql } from "graphql-request";

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
		return rp.post(this.url, {
			...this.options,
			body: {
				query: gql`
			mutation LoginUser{
				login (email: "${email}", password: "${password}"){
					path
					message
				}
			}`,
			},
		});
	}

	async register(email: string, password: string) {
		return rp.post(this.url, {
			...this.options,
			body: {
				query: gql`
					mutation RegisterUser{
						register (email: "${email}", password: "${password}"){
							path
							message
						}
					}
				`,
			},
		});
	}

	async logout() {
		return rp.post(this.url, {
			...this.options,
			body: {
				query: gql`
					mutation LogoutUser {
						logout
					}
				`,
			},
		});
	}

	async me() {
		return rp.post(this.url, {
			...this.options,
			body: {
				query: gql`
					query GetMe {
						me {
							id
							email
						}
					}
				`,
			},
		});
	}

	async forgotPasswordChange(newPassword: string, key: string) {
		return rp.post(this.url, {
			...this.options,
			body: {
				query: gql`
					mutation ForgotPasswordChange {
						forgotPasswordChange(newPassword: "${newPassword}", key: "${key}") {
							path
							message
						}
					}
				`,
			},
		});
	}

	async sendForgotPasswordEmail(email: string) {
		return rp.post(this.url, {
			...this.options,
			body: {
				query: gql`
					mutation SendForgotPasswordEmail {
						sendForgotPasswordEmail(email: "${email}") 
					}
				`,
			},
		});
	}
}
