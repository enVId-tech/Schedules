/* eslint-disable no-unused-vars */
import { MongoClient, Filter, DeleteResult, UpdateResult, Db, Collection } from 'mongodb';

//Credentials
import dotenv from 'dotenv';
dotenv.config({ path: './node/credentials.env' });
const uri: any = process.env.MONGO_URI;
const clientDB: any = process.env.CLIENT_DB;
const client: MongoClient = new MongoClient(uri);

interface DatabaseItem {
  dataIDNum: any;
}

/**
 * Connects to the MongoDB database
 * @returns void
 * @throws Error if an error occurs
 */
async function connectToDatabase(log?: boolean): Promise<void> {
  try {
    await client.connect();
    if (log) {
      console.log("Connected to MongoDB");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error(error);
  }
}

/**
 * Write data to the database collection.
 *
 * @param data Data to be written to the database
 * @param collectionName Name of the collection to write to
 * @param log Whether to log the database connection status
 * @returns The ID of the inserted document
 * @throws CustomError if an error occurs
 */
async function writeToDatabase(
  data: any,
  collectionName: string,
  log: boolean = false
): Promise<any> {
  try {
    await connectToDatabase(log);
    const database: Db = client.db();
    const collection: Collection<DatabaseItem> = database.collection<DatabaseItem>(collectionName);

    const result = await collection.insertOne(data);


    return result.insertedId;
  } catch (error) {
    console.error('Error writing to database:', error);
    throw new Error('Error writing data to the database.');
  }
}
/**
 * @param filter The filter to use when modifying
 * @param update The update object containing the fields to modify
 * @param collectionName The name of the collection to modify
 * @param log (optional) Set to true to log modification messages
 * @returns The number of documents modified
 * @throws Error if an error occurs
 */
async function modifyInDatabase(
  filter: Filter<any>,
  update: any, // Change to a more specific type if possible
  collectionName: string,
  log?: boolean
): Promise<number> {
  try {
    await connectToDatabase(log);

    const database = client.db(clientDB);
    const collection = database.collection(collectionName);

    const { _id, ...updateData } = update;

    const result: UpdateResult = await collection.updateOne(filter, { $set: updateData });

    if (log && result.modifiedCount > 0) {
      console.log("Modified", result.modifiedCount, "document(s)");
    } else if (log && result.modifiedCount === 0) {
      console.log("No documents modified");
    }

    return result.modifiedCount;
  } catch (error) {
    console.error("Error modifying document:", error);
    throw new Error(error);
  }
}

/**
 * @param filter The filter to use when deleting
 * @param collectionName The name of the collection to delete from
 * @param type The type of delete to perform (1 = one, 2 = many)
 * @param log (optional) Set to true to log deletion messages
 * @returns The number of documents deleted, or undefined if no documents were deleted
 * @throws Error if an error occurs
 */
async function deleteFromDatabase(
  filter: Filter<any>,
  collectionName: string,
  type: 1 | 2 | "one" | "many" = 1,
  log?: boolean
): Promise<number | undefined> {
  try {
    await connectToDatabase(log);

    const database = client.db(clientDB);
    const collection = database.collection(collectionName);

    if (type === 1 || type === "one") {
      const result: DeleteResult = await collection.deleteOne(filter);

      if (log && result.deletedCount === 0) {
        console.log("No documents deleted");
      } else if (log && result.deletedCount > 0) {
        console.log("Deleted", result.deletedCount, "document(s)");
      }

      return result.deletedCount;
    } else if (type === 2 || type === "many") {
      const result: DeleteResult = await collection.deleteMany(filter);

      if (log && result.deletedCount === 0) {
        console.log("No documents deleted");
      } else if (log && result.deletedCount > 0) {
        console.log("Deleted", result.deletedCount, "document(s)");
      }

      return result.deletedCount;
    }

    // Add a default return value for any other cases
    return undefined;
  } catch (error) {
    console.error("Error deleting document(s):", error);
    throw new Error(error);
  }
}


/**
 * 
 * @param collectionName The name of the collection to get items from
 * @param dataId The ID of the data to get from the database
 * @returns Returns the items from the database as a JSON string
 * @throws Error if an error occurs
 */
async function getItemsFromDatabase(
  collectionName: string,
  dataId?: any,
  log: boolean = false
): Promise<string> {
  try {
    await connectToDatabase(log);

    const database: Db = client.db();
    const collection: Collection<DatabaseItem> = database.collection<DatabaseItem>(collectionName);

    const projection = { _id: 0 };
    let items: DatabaseItem[] = [];

    if (!dataId) {
      items = await collection.find({}, { projection }).toArray();
    } else {
      items = await collection.find({ dataIDNum: dataId }, { projection }).toArray();
    }

    return JSON.stringify(items);
  } catch (error) {
    console.error('Error getting items from database:', error);
    throw new Error('Error fetching items from the database.');
  }
}

export {
  writeToDatabase,
  modifyInDatabase,
  getItemsFromDatabase,
  deleteFromDatabase
};