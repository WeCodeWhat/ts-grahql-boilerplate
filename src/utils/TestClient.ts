import * as rp from "request-promise";

export const loginMutation = (e: string, p: string) => `
    mutation LoginUser{
        login (email: "${e}", password: "${p}"){
			path
			message
		}
    }`;

export const registerMutation = (e: string, p: string) => `
    mutation RegisterUser{
        register (email: "${e}", password: "${p}"){
			path
			message
		}
    }
`;
export const logoutMutation = `
	mutation LogoutUser{
    	logout
	}
`;

export const meQuery = `
	query GetMe{
		me {
			id
			email
		}
	}
`;
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
			body: { query: loginMutation(email, password) },
		});
	}

	async register(email: string, password: string) {
		return rp.post(this.url, {
			...this.options,
			body: { query: registerMutation(email, password) },
		});
	}

	async logout() {
		return rp.post(this.url, {
			...this.options,
			body: { query: logoutMutation },
		});
	}

	async me() {
		return rp.post(this.url, {
			...this.options,
			body: { query: meQuery },
		});
	}
}
