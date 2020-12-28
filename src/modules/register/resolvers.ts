import { ResolverMap } from "../../utils/graphql-utils";
import * as bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import * as Yup from "yup";
import { formatYupErrors } from "../../utils/formatYupErrors";
import { ErrorMessages } from "./errorMessage";
import { createConfirmedEmailLink } from "../../services/emailService";

const validateSchema = Yup.object().shape({
	email: Yup.string().min(3).max(255).email(),
	password: Yup.string().min(3).max(255),
});

export const resolvers: ResolverMap = {
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
			const hashPassword = await bcrypt.hashSync(password, 10);

			const user = await User.create({
				email,
				password: hashPassword,
			});

			user.save();

			createConfirmedEmailLink(url, user.id, redis);

			return null;
		},
	},
};
