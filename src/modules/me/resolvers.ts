import { GQLResolverMap } from "../../utils/graphql-utils";

import { User } from "../../entity/User";
import { createMiddleware } from "../../utils/createMiddleware";
import middleware from "./middleware";

export const resolvers: GQLResolverMap = {
	Query: {
		me: createMiddleware(middleware, async (_, __, { session }) => {
			const user = (await User.find({ where: { id: session.userId } }))[0];
			if (user)
				return {
					id: user.id,
					email: user.email,
				};
			return null;
		}),
	},
};
