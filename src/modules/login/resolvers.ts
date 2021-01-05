import { GQLResolverMap } from "../../utils/graphql-utils";
import * as bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import * as Yup from "yup";
import { ErrorMessages } from "./errorMessage";
import { USER_SESSION_ID_PREFIX } from "../../constants/global-variables";
import { yupSchemaValidation } from "../../yup.schema";

const validateSchema = Yup.object().shape({
	email: yupSchemaValidation.email,
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

				const passwordIsRight = await bcrypt.compare(password, user.password);
				if (!user || !passwordIsRight) {
					throw new Error();
				}

				if (!user.confirmed) {
					return {
						path: "email",
						message: ErrorMessages.emailIsNotConfirmed,
					};
				}
				//TODO add more test case
				if (user.forgotPasswordLock) {
					return {
						path: "email",
						message: ErrorMessages.forgotPasswordLock,
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
