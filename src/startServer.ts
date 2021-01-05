import "reflect-metadata";
import * as dotenv from "dotenv";
import { GraphQLServer } from "graphql-yoga";
import { eventEmitter, EventEnum } from "./helpers/event";
import { createTypeormConn } from "./utils/createTypeormConn";
import { AddressInfo } from "net";
import { emailRoutes } from "./routes/emailRoutes";
import { ContextParameters } from "graphql-yoga/dist/types";
import { redis } from "./helpers/redis";
import { genSchema } from "./utils/genSchema";
import { sessionConfiguration } from "./config/session.config";
import { EnvironmentType } from "./utils/environment";
import { IServer } from "./utils/graphql-utils";
import { limiter } from "./helpers/rate-limiter";

dotenv.config();

const startServer = async () => {
	/** Generate the list of schema for GraphQL server
	 * @graphql-tools
	 * @graphql-request
	 * @gql2ts
	 * @fs
	 */
	const schema = genSchema();

	/** Create a GraphQL server
	 * @graphql-yoga
	 */
	const server = new GraphQLServer({
		schema,
		context: ({ request }: ContextParameters) => ({
			redis,
			url: request.protocol + "://" + request.get("host"),
			session: request.session as any,
			req: request,
		}),
	} as IServer);

	emailRoutes(server).confirmation(redis);

	/** Express session initialize
	 * @express-session
	 */
	server.express.use(sessionConfiguration);

	// Initialize the rate limiter
	server.express.use(limiter);

	const connection = await createTypeormConn();
	const environment = process.env.NODE_ENV;

	if (environment == EnvironmentType.TEST) return redis.flushdb();
	const isTesting = environment == EnvironmentType.TEST;
	const app = await server.start({
		cors: {
			credentials: true,
			origin: isTesting ? "*" : process.env.FRONTEND_HOST,
		},
		port: isTesting ? 0 : 4000,
	});
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
