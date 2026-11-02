import { MongoClient } from "mongodb";

/** Connect only when a request actually needs the database. */
export async function getDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI must be configured in the deployment environment.");
  }

  let clientPromise = globalThis.__sebakMongoClientPromise;
  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client.connect().then(() => client);
    globalThis.__sebakMongoClientPromise = clientPromise;
  }

  try {
    const client = await clientPromise;
    return client.db(process.env.DB_NAME || "sebak");
  } catch (error) {
    // Allow a later request to retry if the initial connection failed.
    if (globalThis.__sebakMongoClientPromise === clientPromise) {
      delete globalThis.__sebakMongoClientPromise;
    }
    throw error;
  }
}
