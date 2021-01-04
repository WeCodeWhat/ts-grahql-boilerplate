import { GQLResolverMap } from "../../utils/graphql-utils";
import * as bcrypt from "bcryptjs";
import * as Yup from "yup";
import {
	createForgotPasswordLink,
	sendEmailToUser,
} from "../../services/emailService";
import { FORGOT_PASSWORD_PREFIX } from "../../constants/global-variables";
import { User } from "../../entity/User";
import { formatYupErrors } from "../../utils/formatYupErrors";

const validateSchema = Yup.object().shape({
	password: Yup.string().min(3).max(255),
});

export const resolvers: GQLResolverMap = {
	Mutation: {
		sendForgotPasswordEmail: async (
			_: any,
			{ email }: GQL.ISendForgotPasswordEmailOnMutationArguments,
			{ url, session, redis }
		) => {
			// Send reset password link to email
			const link = await createForgotPasswordLink(
				url,
				session.userId as string,
				redis
			);
			const res = await sendEmailToUser(email, link);
			return res;
		},
		forgotPasswordChange: async (
			_: any,
			{ key, newPassword }: GQL.IForgotPasswordChangeOnMutationArguments,
			{ redis }
		) => {
			try {
				await validateSchema.validate({ newPassword });
			} catch (err) {
				return formatYupErrors(err);
			}
			const userId = await redis.get(`${FORGOT_PASSWORD_PREFIX}${key}`);
			await User.update(
				{ id: userId as string },
				{ password: await bcrypt.hash(newPassword, 10) }
			);
			return null;
		},
	},
};
