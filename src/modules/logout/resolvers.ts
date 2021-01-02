import { GQLResolverMap } from "../../utils/graphql-utils";

export const resolvers: GQLResolverMap = {
	Mutation: {
		logout: async (_, __, { session }) => {
			new Promise((resolve) =>
				session.destroy((err) => {
					if (err) {
						console.log(err);
					}
					resolve(true);
				})
			);
		},
	},
};
