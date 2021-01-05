import { GraphQLServer } from "graphql-yoga";
import { Redis } from "ioredis";
import { Request, Response } from "express";
import { User } from "../entity/User";
// import { gql, request as gqlReq } from "graphql-request"

export const emailRoutes = (server: GraphQLServer) => ({
	confirmation: (redis: Redis) => {
		server.express.get("/confirm/:id", async (req: Request, res: Response) => {
			const { id } = req.params;
			const userId = await redis.get(id);
			if (userId) {
				await User.update({ id: userId as string }, { confirmed: true });
				redis.del(id);
				res.send("ok").status(200);
			} else {
				res.send("invalid");
			}
		});
	},
	// forgotPasswordRoute: (redis: Redis)=> {
	// 	server.express.get("/change-password/:id", async (req: Request, res: Response) => {
	// 		const { id } = req.params;
	// 		await gqlReq(req.baseUrl, gql`
	// 			mutation ForgotPassword{
	// 				forgotPasswordChange(key: "${id}", newPassword: "${newPassword}"){}
	// 			}
	// 		`)
	// 		try {

	// 		} catch (error) {

	// 		}
	// 	});
	// }
});
