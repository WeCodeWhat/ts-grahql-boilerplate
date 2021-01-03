import { USER_SESSION_ID_PREFIX } from "../../constants/global-variables";
import { GQLResolverMap } from "../../utils/graphql-utils";

export const resolvers: GQLResolverMap = {
	Mutation: {
		logout: async (_, __, { session, redis }) => {
			const { userId } = session;
			if (userId) {
				const sessionIds = await redis.lrange(
					`${USER_SESSION_ID_PREFIX}${userId}`,
					0,
					-1
				);
				const promises: Promise<any>[] = [];
				for (let i = 0; i < sessionIds.length; i++) {
					promises.push(redis.del(`${USER_SESSION_ID_PREFIX}${sessionIds[i]}`));
				}
				await Promise.all(promises);

				session.destroy((err) => {
					if (err) return false;
					return true;
				});
			}
			return false;
		},
	},
};
