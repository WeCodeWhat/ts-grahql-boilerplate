import { ResolverMap } from "../../utils/graphql-utils";
import * as bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import * as Yup from "yup";
import { ErrorMessages } from "./errorMessage";

const validateSchema = Yup.object().shape({
	email: Yup.string().min(3).max(255).email(),
});

export const resolvers: ResolverMap = {
	Mutation: {
		login: async (_: any, args: GQL.ILoginOnMutationArguments, { session }) => {
			const { email, password } = args;

			try {
				await validateSchema.validate(args, { abortEarly: false });

				const user = (await User.find({ where: { email } }))[0];

				await bcrypt.compare(password, user.password);
				if (!user) {
					throw new Error();
				}

				if (!user.confirmed) {
					return {
						path: "email",
						message: ErrorMessages.emailIsNotConfirmed,
					};
				}

				// Login Successfully
				session.userId = user.id;

				return null;
			} catch (err) {
				return {
					path: "email",
					message: ErrorMessages.defaultMessage,
				};
			}
		},
	},
};
