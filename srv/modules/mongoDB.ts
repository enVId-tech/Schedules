/* eslint-disable no-unused-vars */
import { Collection, Db, DeleteResult, Filter, MongoClient, UpdateResult } from 'mongodb';
import { CLIENT_DB, URI } from '../configs/env.ts';

const client: MongoClient = new MongoClient(URI);

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
  } catch (error: any) {
    console.error(`Error connecting to MongoDB:${error}`);
    throw new Error(error as string);
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
  log: boolean
): Promise<any> {
  try {
    await connectToDatabase(log);
    const database: Db = client.db(CLIENT_DB);
    const collection: Collection<any> = database.collection(collectionName);

    const result: any = await collection.insertOne(data);

    let boolInsert;

    if (result.insertedId) {
      console.log("Inserted document with _id:", result.insertedId);
      boolInsert = true;
    } else {
      console.log("No document was inserted");
      boolInsert = false;
    }

    return [result.insertedId, boolInsert];
  } catch (error: any) {
    console.error(`Error writing to database: ${error}`);
    throw new Error(error);
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

    const database: Db = client.db(CLIENT_DB);
    const collection: Collection<any> = database.collection(collectionName);

    const updateData = { $set: update };

    const result: UpdateResult = await collection.updateOne(filter, updateData);

    if (log && result.modifiedCount > 0) {
      console.log("\x1b[32m", "Modified", result.modifiedCount, "document(s)");
    } else if (log && result.modifiedCount === 0) {
      console.log("\x1b[32m", "No documents modified");
    }

    return result.modifiedCount;
  } catch (error: any) {
    console.error("\x1b[31m", `Error modifying document:, ${error}`);
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
): Promise<number> {
  try {
    await connectToDatabase(log);

    const database = client.db(CLIENT_DB);
    const collection = database.collection(collectionName);

    if (type === 1 || type === "one") {
      const result: DeleteResult = await collection.deleteOne(filter);

      if (log && result.deletedCount === 0) {
        console.log("\x1b[32m", "No documents deleted");
      } else if (log && result.deletedCount > 0) {
        console.log("\x1b[32m", "Deleted", result.deletedCount, "document(s)");
      }

      return result.deletedCount;
    } else if (type === 2 || type === "many") {
      const result: DeleteResult = await collection.deleteMany(filter);

      if (log && result.deletedCount === 0) {
        console.log("\x1b[32m","No documents deleted");
      } else if (log && result.deletedCount > 0) {
        console.log("\x1b[32m", "Deleted", result.deletedCount, "document(s)");
      }

      return result.deletedCount;
    }

    // Add a default return value for any other cases
    return 0;
  } catch (error: any) {
    console.error("\x1b[31m", `Error deleting document(s):, ${error}`);
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
  log?: boolean,
  dataId?: any
): Promise<any> {
  try {
    await connectToDatabase(log);

    const database: Db = client.db(CLIENT_DB);
    const collection: Collection<any> = database.collection(collectionName);
    const projection: any = { _id: 0 };

    let items: any;

    if (dataId) {
      items = await collection.findOne( dataId, { projection: projection });
    } else {
      items = await collection.find({}).toArray();
    }

    return JSON.stringify(items);
  } catch (error: any) {
    console.error("\x1b[31m", `Error getting items from database:, ${error}`);
    throw new Error(error);
  }
}

const mongoFuncs = {
  writeToDatabase,
  modifyInDatabase,
  getItemsFromDatabase,
  deleteFromDatabase
};

export default mongoFuncs;