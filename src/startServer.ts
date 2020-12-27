import { GraphQLServer } from "graphql-yoga";
import { importSchema } from "graphql-import";
import { resolvers } from "./resolvers";
import * as path from "path";
import { eventEmitter, EventEnum } from "./helpers/event";
import { createTypeormConn } from "./helpers/orm";
import { AddressInfo } from "net";

const startServer = async () => {
	/** Create the typeDefs with file schema.graphql
	 * @package graphql-import
	 */
	const typeDefs = importSchema(path.join(__dirname, `./schema.graphql`));

	/** Create a GraphQL server
	 * @package graphql-yoga
	 */
	const server: GraphQLServer = new GraphQLServer({ typeDefs, resolvers });

	const connection = await createTypeormConn();
	const environment = process.env.NODE_ENV;
	const app = await server.start({ port: environment == "test" ? 0 : 4000 });
	console.log(
		`[${environment?.toUpperCase().trim()}] server is running on localhost:${
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
