import { MongoClient } from 'mongodb';
import { ObjectId } from 'bson';
import {uri, db_name} from './mongodb/connection';

// https://www.mongodb.com/docs/drivers/node/current/usage-examples/

// function gets item from database by item's id
// params: id of the item, name of the table (collection) we are searching in
// returns promise of object from database
export async function getItemById(id: string, table_name: string) {
  const client = new MongoClient(uri);
  const database = client.db(db_name);
  try {
    const table: any = database.collection(table_name);
    
    const item = await table.findOne({_id: id});
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
    
    const cursor = table.find(
      query,
      {
        sort: { _id: 1 }
      }
    );

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
    
    const res = await table.deleteOne({_id: new ObjectId(id)});
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
// returns promise of result object (acknowledged: true/false, modifiedCount, upsertedId (if item is upserted): null, upsertedCount: 0, matchedCount: 1)
export async function updateItemById(id: string, table_name: string, updateQuery: Object) {
  const client = new MongoClient(uri);
  const database = client.db(db_name);
  try {
    const table: any = database.collection(table_name);
    
    const res = await table.updateOne(
      {_id: new ObjectId(id)},
      { $set:
         updateQuery
      }
    );

    return res;
  } finally {
    await client.close();
  }
}

// function updates multiple items by field
// params: object {field: "value"}, name of the table, query with values to update
// returns promise of result object (acknowledged: true/false, modifiedCount, upsertedId (if item is upserted): null, upsertedCount: 0, matchedCount: 1)
export async function updateItemsByField(query: Object, table_name: string, updateQuery: Object) {
  const client = new MongoClient(uri);
  const database = client.db(db_name);
  try {
    const table: any = database.collection(table_name);
    
    const res = await table.updateMany(
      query,
      { $set:
         updateQuery
      }
    );
    console.log(res);

    return res;
  } finally {
    await client.close();
  }
}


// replace, steal? (find one and delete)




