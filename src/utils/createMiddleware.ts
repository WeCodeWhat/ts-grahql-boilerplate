import { GQLResolverFunction, GQLMiddlewareFunction } from "./graphql-utils";

/**
 * @package graphql-add-middleware
 **/
export const createMiddleware = (
	middlewareFunc: GQLMiddlewareFunction,
	resolverFunc: GQLResolverFunction
) => (parent: any, args: any, context: any, info: any) =>
	middlewareFunc(resolverFunc, parent, args, context, info);
