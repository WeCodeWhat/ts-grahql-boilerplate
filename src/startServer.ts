import { GraphQLServer } from "graphql-yoga";
import { eventEmitter, EventEnum } from "./helpers/event";
import { createTypeormConn } from "./utils/createTypeormConn";
import { AddressInfo } from "net";
import * as Redis from "ioredis";
import { emailRoutes } from "./routes/emailRoutes";
import { ContextParameters } from "graphql-yoga/dist/types";
import { redis } from "./helpers/redis";
import { genSchema } from "./utils/genSchema";
interface IServer {
	schema: any;
	context: () => {
		redis: Redis.Redis;
		url: string;
	};
}

const startServer = async () => {
	/** Generate the list of schema for GraphQL server
	 * @package graphql-tools
	 * @package graphql-request
	 * @package fs
	 */
	const schema = genSchema();

	/** Create a GraphQL server
	 * @package graphql-yoga
	 */
	const server = new GraphQLServer({
		schema,
		context: ({ request }: ContextParameters) => ({
			redis,
			url: request.protocol + "://" + request.get("host"),
		}),
	} as IServer);

	emailRoutes(server).confirmation(redis);

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
