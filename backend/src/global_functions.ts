import { MongoClient } from 'mongodb';
import {uri, db_name} from './mongodb/connection';

// https://www.mongodb.com/docs/drivers/node/current/usage-examples/

// function gets item from database by item's id
// params: id of an item, name of the table (collection) we are searching in
// returns promise of object from database
export async function getItemById(id: number, table_name: string) {
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
export async function insertItem(item: any, table_name: string) {
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



// delete, delete multiple, get multiple items by field, update, update multiple, replace




