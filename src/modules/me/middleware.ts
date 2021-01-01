import { User } from "../../entity/User";
import { GQLResolverFunction } from "../../utils/graphql-utils";

export default async (
	resolver: GQLResolverFunction,
	parent: any,
	args: any,
	context: any,
	info: any
) => {
	// console.log("args given: ", args);
	// // middleware

	// if (!context.session?.userId) throw new Error("no cookie");
	// const user = await User.findOne({ where: { id: context.session.userId } });
	// console.log("middleware user: ", user);
	const res = await resolver(parent, args, context, info);
	// afterware
	console.log("Result: ", res);
	return res;
};
