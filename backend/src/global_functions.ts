import { MongoClient } from 'mongodb';
import {uri, db_name} from './mongodb/connection';


export async function getItemById(id: number, table_name: string) {
    const client = new MongoClient(uri);
    const database = client.db(db_name);
  try {
    const items: any = database.collection(table_name);
    
    const item = await items.findOne({_id: id});
    return item;
  } finally {
    await client.close();
  }

}



