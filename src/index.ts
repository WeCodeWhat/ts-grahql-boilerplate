import "reflect-metadata";
import * as dotenv from "dotenv";
import { GraphQLServer } from "graphql-yoga";
import { importSchema } from "graphql-import";
import { resolvers } from "./resolvers";
import * as path from "path";
import { eventEmitter, EventEnum } from "./helpers/event";
import { createTypeormConn } from "./helpers/orm";

dotenv.config();

const debug = function ConsoleDebug(isEnabled: Boolean) {
	if (isEnabled) {
		console.log = () => {};
		console.group = console.groupEnd = () => {};
		console.warn = console.error = () => {};
	} else return;
};

export const startServer = async () => {
	/** Create the typeDefs with file schema.graphql
	 * @package graphql-import
	 */
	const typeDefs = importSchema(path.join(__dirname, `./schema.graphql`));

	/** Create a GraphQL server
	 * @package graphql-yoga
	 */
	const server: GraphQLServer = new GraphQLServer({ typeDefs, resolvers });

	await createTypeormConn().then(async () => {
		await server.start();
		console.log(`Server is running on localhost:${process.env.SERVER_PORT}`);
		eventEmitter.emit(EventEnum.SERVER_CONNECTED);
	});
};

debug(false);
startServer();
