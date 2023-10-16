import { MongoClient } from "mongodb";
import { ObjectId } from "bson";
import { uri, db_name } from "./mongodb/connection";

// https://www.mongodb.com/docs/drivers/node/current/usage-examples/

// function gets item from database by item's id
// params: id of the item, name of the table (collection) we are searching in
// returns promise of object from database
export async function getAllItems(table_name: string) {
  const client = new MongoClient(uri);
  const database = client.db(db_name);
  try {
    const table: any = database.collection(table_name);
    const cursor = await table.find();
    const items: any[] = [];
    for await (const doc of cursor) {
      items.push(doc);
    }
    return items;
  } finally {
    await client.close();
  }
}

// function gets item from database by item's id
// params: id of the item, name of the table (collection) we are searching in
// returns promise of object from database
export async function getItemById(id: string, table_name: string) {
  const client = new MongoClient(uri);
  const database = client.db(db_name);
  try {
    const table: any = database.collection(table_name);

    const item = await table.findOne({ _id: new ObjectId(id) });
    return item;
  } finally {
    await client.close();
  }
}

// function returns multiple items by field and value, sorted by id
// params: object {field: "value"}, name of the table
// returns promise of array of objects
export async function getItemsByField(query: Object, table_name: string) {
  const client = new MongoClient(uri);
  const database = client.db(db_name);
  try {
    const table: any = database.collection(table_name);

    const cursor = table.find(query, {
      sort: { _id: 1 },
    });

    const res = await cursor.toArray();
    return res;
  } finally {
    await client.close();
  }
}

// function inserts item to database
// params: item, name of the table
// returns promise of result object (acknowledged: true/false and insertedId: id of inserted item)
export async function insertItem(item: Object, table_name: string) {
  const client = new MongoClient(uri);
  const database = client.db(db_name);
  try {
    const table: any = database.collection(table_name);

    const res = await table.insertOne(item);
    return res;
  } finally {
    await client.close();
  }
}

// function deletes item by id
// params: id of the item, name of the table
// returns promise of result object (acknowledged: true/false and deletedCount)
export async function deleteItemById(id: string, table_name: string) {
  const client = new MongoClient(uri);
  const database = client.db(db_name);
  try {
    const table: any = database.collection(table_name);

    const res = await table.deleteOne({ _id: new ObjectId(id) });
    return res;
  } finally {
    await client.close();
  }
}

// function deletes multiple items by field and value
// params: object {field: "value"}, name of the table
// returns promise of result object (acknowledged: true/false and deletedCount)
export async function deleteItemsByField(query: Object, table_name: string) {
  const client = new MongoClient(uri);
  const database = client.db(db_name);
  try {
    const table: any = database.collection(table_name);

    const res = await table.deleteMany(query);
    return res;
  } finally {
    await client.close();
  }
}

// function updates item by id
// params: id of the item, name of the table, query with values to update
// returns promise of result object (acknowledged: true/false, modifiedCount, upsertedId (if item is upserted), upsertedCount, matchedCount)
export async function updateItemById(
  id: string,
  table_name: string,
  updateQuery: Object
) {
  const client = new MongoClient(uri);
  const database = client.db(db_name);
  try {
    const table: any = database.collection(table_name);

    const res = await table.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateQuery }
    );

    return res;
  } finally {
    await client.close();
  }
}

// function updates multiple items by field
// params: object {field: "value"}, name of the table, query with values to update
// returns promise of result object (acknowledged: true/false, modifiedCount, upsertedId (if item is upserted), upsertedCoun, matchedCount)
export async function updateItemsByField(
  query: Object,
  table_name: string,
  updateQuery: Object
) {
  const client = new MongoClient(uri);
  const database = client.db(db_name);
  try {
    const table: any = database.collection(table_name);

    const res = await table.updateMany(query, { $set: updateQuery });

    return res;
  } finally {
    await client.close();
  }
}

// function replaces one item with another, finds by id
// params: id of the item, name of the table, new item
// returns promise of result object (acknowledged: true/false, modifiedCount, upsertedId (if item is upserted), upsertedCount, matchedCount)
export async function replaceItemById(
  id: string,
  table_name: string,
  newItem: Object
) {
  const client = new MongoClient(uri);
  const database = client.db(db_name);
  try {
    const table: any = database.collection(table_name);

    const res = await table.replaceOne({ _id: new ObjectId(id) }, newItem);

    return res;
  } finally {
    await client.close();
  }
}

// function gets one item by id, then deletes it from database
// params: id of the item, name of the table
// returns promise of result object (res.value, but it also has few other informations)
export async function stealItemById(id: string, table_name: string) {
  const client = new MongoClient(uri);
  const database = client.db(db_name);
  try {
    const table: any = database.collection(table_name);

    const res = await table.findOneAndDelete({ _id: new ObjectId(id) });
    return res;
  } finally {
    await client.close();
  }
}