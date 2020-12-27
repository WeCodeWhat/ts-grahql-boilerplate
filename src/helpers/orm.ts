import { createConnection, getConnectionOptions } from "typeorm";

/** Create connection with TypeORM
 * https://typeorm.io/#/connection
 * @package typeorm
 */
export const createTypeormConn = async function CreateTypeORMConnection() {
	const connectionOptions = await getConnectionOptions(
		process.env.NODE_ENV?.trim()
	);
	return createConnection({ ...connectionOptions, name: "default" });
};
