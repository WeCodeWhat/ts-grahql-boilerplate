import { IResolvers } from "graphql-tools";
import { ResolverMap } from "./graphql-utils";

export const resolvers: ResolverMap = {
	Query: {
		hello: (_: any, { name }: GQL.IHelloOnQueryArguments) =>
			`Hello ${name || "World"}`,
	},
	Mutation: {
		register: (
			_: any,
			{ email, password }: GQL.IRegisterOnMutationArguments
		) => {},
	},
};
