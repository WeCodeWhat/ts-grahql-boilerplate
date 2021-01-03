import { GQLResolverMap } from "../../utils/graphql-utils";
import * as bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import * as Yup from "yup";
import { ErrorMessages } from "./errorMessage";
import { USER_SESSION_ID_PREFIX } from "../../constants/global-variables";

const validateSchema = Yup.object().shape({
	email: Yup.string().min(3).max(255).email(),
});

export const resolvers: GQLResolverMap = {
	Mutation: {
		login: async (
			_: any,
			args: GQL.ILoginOnMutationArguments,
			{ session, redis, req }
		) => {
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
				if (req.sessionID) {
					redis.lpush(`${USER_SESSION_ID_PREFIX}${user.id}`, user.id);
				}

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
