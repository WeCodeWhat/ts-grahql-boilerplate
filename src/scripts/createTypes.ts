import { generateNamespace } from "@gql2ts/from-schema";
import { genSchema } from "../utils/genSchema";
import * as path from "path";
import * as fs from "fs";

const typescriptTypes = generateNamespace("GQL", genSchema());

fs.writeFile(
	path.join(__dirname, "../types/schema.d.ts"),
	typescriptTypes,
	(err) => {
		console.log(err);
	}
);
