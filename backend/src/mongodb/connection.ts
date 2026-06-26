const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

export const uri = process.env.MONGO_CONNECTION_STRING!;

export const db_name = 'main_db';
