import "reflect-metadata";
import * as dotenv from "dotenv";
import { GraphQLServer } from "graphql-yoga";
import { importSchema } from "graphql-import";
import { resolvers } from "./resolvers";
import { createConnection } from "typeorm";
import * as path from "path";

dotenv.config();

const debug = function ConsoleDebug(isEnabled: Boolean) {
	if (isEnabled) {
		console.log = () => {};
		console.group = console.groupEnd = () => {};
		console.warn = console.error = () => {};
	} else return;
};

debug(false);

/**
 * Create the typeDefs with file schema.graphql
 * @package graphql-import
 */
const typeDefs = importSchema(path.join(__dirname, "./schema.graphql"));

/**
 * Create a GraphQL server
 * @package graphql-yoga
 */
const server = new GraphQLServer({ typeDefs, resolvers });

/**
 * Create connection with TypeORM
 * https://typeorm.io/#/connection
 * @package typeorm
 */
const connection = async () =>
	await createConnection().then(() => {
		server.start(() =>
			console.log(`Server is running on localhost:${process.env.SERVER_PORT}`)
		);
	});

connection();
