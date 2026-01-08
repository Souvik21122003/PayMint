import { PrismaClient } from "../generated/prisma-client/client.js";
import { PrismaNeon } from "@prisma/adapter-neon";
import { WebSocket } from "ws";
import fetch from "undici";

global.WebSocket = WebSocket;
global.fetch = fetch;

import "dotenv/config";
const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaNeon({ connectionString });

const prisma = new PrismaClient({
  adapter,
});

export { prisma };
