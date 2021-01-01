import { GQLResolverFunction } from "../../utils/graphql-utils";

export default async (
	resolver: GQLResolverFunction,
	parent: any,
	args: any,
	context: any,
	info: any
) => {
	// middleware
	const res = await resolver(parent, args, context, info);

	// afterware
	return res;
};
