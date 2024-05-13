import { de } from "@faker-js/faker";
import MongoDB, { MongoClient } from "mongodb";

class MongoConnection {
  private connectionString: string;
  private db: string;
  private collection: string;
  #instance: MongoDB.Collection;

  constructor(connectionString: string) {
    const { pathname: dbName } = new URL(connectionString);
    this.connectionString = connectionString.replace(dbName, "");
    this.db = dbName.replace(/\W/, "");
    this.collection = "notification_logs";
  }

  async connect() {
    const client = new MongoClient(this.connectionString, {
      useUnifiedTopology: true,
    } as MongoDB.MongoClientOptions);
    await client.connect();
    const db = client.db(this.db).collection(this.collection);
    this.#instance = db;
  }

  async create(item: any) {
    return this.#instance.insertOne(item);
  }

  async read() {
    return this.#instance.find().sort({ _id: -1 }).toArray();
  }
}

export default MongoConnection;
