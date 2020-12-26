import * as Events from "events";
export const eventEmitter: Events.EventEmitter = new Events.EventEmitter();

export enum EventEnum {
	SERVER_CONNECTED = "server-connected",
}
