import { MongoClient } from "mongodb";

let client = globalThis.__sebakMongoClient;

if (!client) {
  client = new MongoClient(process.env.MONGODB_URI);
  globalThis.__sebakMongoClient = client;
}

export const db = client.db(process.env.DB_NAME || "sebak");
