import { MongoClient } from "mongodb";

/* One shared client is enough; a fresh one on every hot reload would pile
   up connections, so it is cached on the global object. */
let client = globalThis.__sebakMongoClient;

if (!client) {
  client = new MongoClient(process.env.MONGODB_URI);
  globalThis.__sebakMongoClient = client;
}

/* The users, sessions and JWT keys of BetterAuth live in the same
   database as the events API. */
export const db = client.db(process.env.DB_NAME || "sebak");
