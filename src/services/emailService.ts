import { v4 } from "uuid";
import * as Redis from "ioredis";
import * as SparkPost from "sparkpost";
import * as dotenv from "dotenv";

dotenv.config();

const SparkPostClient = new SparkPost(process.env.SPARKPOST_KEY);

export const createConfirmedEmailLink = async (
	url: string,
	userId: string,
	redis: Redis.Redis
) => {
	const id = v4();
	await redis.set(id, userId, "ex", 60 * 60 * 24);
	return `${url}/confirm/${id}`;
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
