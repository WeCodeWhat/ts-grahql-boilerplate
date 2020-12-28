import { GraphQLSchema } from "graphql";
import * as fs from "fs";
import { importSchema } from "graphql-import";
import * as path from "path";
import { makeExecutableSchema, mergeSchemas } from "graphql-tools";

export const genSchema = (): GraphQLSchema => {
	const schemas: GraphQLSchema[] = Array();
	const folders = fs.readdirSync(path.join(__dirname, "../modules"));
	folders.forEach((folder) => {
		const { resolvers }: any = require(`../modules/${folder}/resolvers`);
		/** Create the typeDefs with file schema.graphql
		 * @package graphql-import
		 */
		const typeDefs: any = importSchema(
			path.join(__dirname, `../modules/${folder}/schema.graphql`)
		);
		schemas.push(makeExecutableSchema({ resolvers, typeDefs }));
	});

	return mergeSchemas({ schemas });
};
