import { v4 } from "uuid";
import * as Redis from "ioredis";
import * as nodemailer from "nodemailer";

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
	let testAccount = await nodemailer.createTestAccount();

	let transporter = nodemailer.createTransport({
		host: email,
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: testAccount.user, // generated ethereal user
			pass: testAccount.pass, // generated ethereal password
		},
	});

	// send mail with defined transport object
	let info = await transporter.sendMail(
		{
			from: '"Fred Foo 👻" <foo@example.com>', // sender address
			to: email, // list of receivers
			subject: "Confirmation Link", // Subject line
			text: "Confirmation Link", // plain text body
			html: `<b>Confirmation Link: ${link}</b>`, // html body
		},
		(err, info) => {
			if (err) {
				console.log(err);
				throw new Error(err.message);
			} else {
				console.log("Message sent: %s", info.response);
			}
		}
	);

	return info;
};
