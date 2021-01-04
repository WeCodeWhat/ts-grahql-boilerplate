import { GQLResolverMap } from "../../utils/graphql-utils";
import { removeAllUserSession } from "../../utils/removeUserSession";

export const resolvers: GQLResolverMap = {
	Mutation: {
		logout: async (_, __, { session, redis }) => {
			const { userId } = session;
			if (userId) {
				await removeAllUserSession(userId, session, redis);
				return true;
			}
			return false;
		},
	},
};
