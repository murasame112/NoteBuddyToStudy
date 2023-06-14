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


// delete multiple, get multiple items by field, update, update multiple, replace, steal? (find one and delete)




