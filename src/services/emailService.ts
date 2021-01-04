import { v4 } from "uuid";
import * as Redis from "ioredis";
import * as SparkPost from "sparkpost";
import * as dotenv from "dotenv";
import {
	EMAIL_CONFIRM_PREFIX,
	FORGOT_PASSWORD_PREFIX,
} from "../constants/global-variables";

dotenv.config();

const SparkPostClient = new SparkPost(process.env.SPARKPOST_KEY);

export const createConfirmedEmailLink = async (
	url: string,
	userId: string,
	redis: Redis.Redis
) => {
	const id = v4();
	await redis.set(`${EMAIL_CONFIRM_PREFIX}${id}`, userId, "ex", 60 * 20);
	return `${url}/confirm/${id}`;
};

export const createForgotPasswordLink = async (
	url: string,
	userId: string,
	redis: Redis.Redis
) => {
	const id = v4();
	await redis.set(`${FORGOT_PASSWORD_PREFIX}${id}`, userId, "ex", 60 * 20);
	return `${url}/change-password/${id}`;
};

export const sendEmailToUser = async (email: string, link: string) => {
	try {
		await SparkPostClient.transmissions.send({
			options: {
				sandbox: true,
			},
			content: {
				from: "testing@sparkpostbox.com",
				subject: "Confirmation Email",
				html: `<html><body><p>Confirmation Link: ${link} </p></body></html>`,
			},
			recipients: [{ address: `${email}.sink.sparkpostmail.com` }],
		});
		console.log("Email sent successfully");
		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
};
