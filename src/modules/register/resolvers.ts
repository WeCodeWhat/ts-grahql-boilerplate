import { GQLResolverMap } from "../../utils/graphql-utils";
import { User } from "../../entity/User";
import * as Yup from "yup";
import { formatYupErrors } from "../../utils/formatYupErrors";
import { ErrorMessages } from "./errorMessage";
import {
	createConfirmedEmailLink,
	sendEmailToUser,
} from "../../services/emailService";
import { yupSchemaValidation } from "../../yup.schema";

const validateSchema = Yup.object().shape({
	email: yupSchemaValidation.email,
	password: yupSchemaValidation.password,
});

export const resolvers: GQLResolverMap = {
	Mutation: {
		register: async (
			_: any,
			args: GQL.IRegisterOnMutationArguments,
			{ redis, url }
		) => {
			const { email, password } = args;
			try {
				await validateSchema.validate(args, { abortEarly: false });
			} catch (err) {
				return formatYupErrors(err);
			}
			const isEmailRegistered = await User.findOne({
				where: { email },
				select: ["id"],
			});
			if (isEmailRegistered) {
				return [
					{
						path: "email",
						message: ErrorMessages.duplicateEmail,
					},
				];
			}

			const user = await User.create({
				email,
				password,
			}).save();

			const link = await createConfirmedEmailLink(url, user.id, redis);

			await sendEmailToUser(user.email, link);

			return null;
		},
	},
};
