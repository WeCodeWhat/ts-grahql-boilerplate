import { ResolverMap } from "./utils/graphql-utils";
import * as bcrypt from "bcryptjs";
import { User } from "./entity/User";

export const resolvers: ResolverMap = {
	Query: {
		hello: (_: any, { name }: GQL.IHelloOnQueryArguments) =>
			`Hello ${name || "World"}`,
	},
	Mutation: {
		register: async (
			_: any,
			{ email, password }: GQL.IRegisterOnMutationArguments
		) => {
			const hashPassword = await bcrypt.hashSync(password, 10);
			try {
				await User.create({
					email,
					password: hashPassword,
				}).save();
				return true;
			} catch (error) {
				console.log(error);
				return false;
			}
		},
	},
};
