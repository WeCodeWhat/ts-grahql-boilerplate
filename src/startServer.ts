import { GraphQLServer } from "graphql-yoga";
import { importSchema } from "graphql-import";
import * as path from "path";
import { eventEmitter, EventEnum } from "./helpers/event";
import { createTypeormConn } from "./helpers/orm";
import { AddressInfo } from "net";
import { mergeSchemas, makeExecutableSchema } from "graphql-tools";
import { GraphQLSchema } from "graphql";
import * as fs from "fs";

const startServer = async () => {
	const schemas: GraphQLSchema[] = [];
	const folders = fs.readdirSync(path.join(__dirname, "./modules"));
	folders.forEach((folder) => {
		const { resolvers } = require(`./modules/${folder}/resolvers`);
		/** Create the typeDefs with file schema.graphql
		 * @package graphql-import
		 */
		const typeDefs = importSchema(
			path.join(__dirname, `./modules/${folder}/schema.graphql`)
		);
		schemas.push(makeExecutableSchema({ resolvers, typeDefs }));
	});
	/** Create a GraphQL server
	 * @package graphql-yoga
	 */
	const server = new GraphQLServer({ schema: mergeSchemas({ schemas }) } as {
		schema: any;
	});
	const connection = await createTypeormConn();
	const environment = process.env.NODE_ENV;
	const app = await server.start({ port: environment == "test" ? 0 : 4000 });
	console.log(
		`[${environment?.toUpperCase().trim()}] server is running on port ${
			(app.address() as AddressInfo).port
		}`
	);
	eventEmitter.emit(EventEnum.SERVER_CONNECTED);
	return {
		CONN: connection,
		APP: app,
	};
};

export default startServer;
