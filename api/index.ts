import { IncomingMessage, ServerResponse } from "node:http";
import handler from "../src/index.js";

export default async (req: IncomingMessage, res: ServerResponse) => {
  return handler(req, res);
};
