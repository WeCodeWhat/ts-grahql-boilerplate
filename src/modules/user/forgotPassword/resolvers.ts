import { GQLResolverMap } from "../../../utils/graphql-utils";
import * as bcrypt from "bcryptjs";
import * as Yup from "yup";
import {
	createForgotPasswordLink,
	sendEmailToUser,
} from "../../../services/emailService";
import { FORGOT_PASSWORD_PREFIX } from "../../../constants/global-variables";
import { User } from "../../../entity/User";
import { formatYupErrors } from "../../../utils/formatYupErrors";
import { forgotPasswordLockAccount } from "../../../utils/forgotPasswordLockAccount";
import { ErrorMessage } from "./ErrorMessage";
import { yupSchemaValidation } from "../../../yup.schema";

const validateSchema = Yup.object().shape({
	password: yupSchemaValidation.password,
});

export const resolvers: GQLResolverMap = {
	Mutation: {
		sendForgotPasswordEmail: async (
			_: any,
			{ email }: GQL.ISendForgotPasswordEmailOnMutationArguments,
			{ redis }
		) => {
			const user = await User.findOne({ where: { email } });
			if (!user) {
				return [
					{
						path: "email",
						message: ErrorMessage.userIsNotExist,
					},
				];
			}
			await forgotPasswordLockAccount(user.id, redis);
			// Send reset password link to email
			const link = await createForgotPasswordLink(
				process.env.FRONTEND_HOST,
				user.id,
				redis
			);
			await sendEmailToUser(email, link);
			return null;
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
			if (!userId) {
				return [
					{
						path: "key",
						message: ErrorMessage.expiredKeyError,
					},
				];
			}
			await User.update(
				{ id: userId as string },
				{
					password: await bcrypt.hash(newPassword, 10),
					forgotPasswordLock: false,
				}
			);
			return null;
		},
	},
};
