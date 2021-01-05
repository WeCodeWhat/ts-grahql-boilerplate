import { GraphQLSchema } from "graphql";
import * as fs from "fs";
import * as path from "path";
import { mergeResolvers, mergeTypes } from "merge-graphql-schemas";
import { makeExecutableSchema } from "graphql-tools";
import * as glob from "glob";

export const genSchema = (): GraphQLSchema => {
	const pathToModules = path.join(__dirname, "../modules");

	const typeDefs = glob
		.sync(`${pathToModules}/**/*.graphql`)
		.map((type) => fs.readFileSync(type, { encoding: "utf8" }));

	const resolvers = glob
		.sync(`${pathToModules}/**/resolvers.?s`)
		.map((resolver) => require(resolver).resolvers);

	return makeExecutableSchema({
		resolvers: mergeResolvers(resolvers),
		typeDefs: mergeTypes(typeDefs),
	});
};
