import { Console } from "console";
import { ObjectId } from "bson";
import express from "express";
import e, { Request, Response } from "express";
import { Log } from "../models/log_model";
import * as global from "../global_database_functions";
import { Type } from "../enums/log_type_enum";
import * as globalTools from "../global_tools";

const table_name = "logs";

// finds all logs
// /logs
// example:
//  http://localhost:3000/logs
export function getAllLogs(req: Request, res: Response) {
  const result = global.getAllItems(table_name);
  result.then((value) => {
    res.send(value);
  });
}

// finds log by id
// /log/{id}
// example:
//  http://localhost:3000/log/648c6400e388683aeb23d331
export function getLogById(req: Request, res: Response) {
  const id = req.params.id;
  const result = global.getItemById(id, table_name);
  let log: Log;
  result.then((value) => {
    log = new Log(value.type, value.content, value.date);
    res.send(log);
  });
}

// finds multiple logs by field and value
// /logs/{field}&{value}
// example:
//  http://localhost:3000/logs/published&true
export function getLogsByQuery(req: Request, res: Response) {
  const field = req.params.field;
  let value: any; 
	value = req.params.value;

  try {
    value = JSON.parse(value);
  } catch (e: any) {
    value = '"' + value + '"';
    value = JSON.parse(value);
  }

	if(field == 'date'){
		if(typeof value == 'string'){
			value = new Date(value);
		}
	}

  let query = { [field]: value };
  const result = global.getItemsByField(query, table_name);
  const logArray: Log[] = [];
  let log: Log;
  result.then((value) => {
    value.forEach((element: Log) => {
      log = new Log(element.type, element.content, element.date);
      logArray.push(log);
    });
    res.send(logArray);
  });
}

// inserts log to database
// /log
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/log
// example body:
//   {
//      "type":"ERROR",
//      "content":"Serce przestało działać"
// }
export function insertLog(req: Request, res: Response) {
  const log: Log = new Log(req.body.type, req.body.content);
  const result = global.insertItem(log, table_name);
  result.then((value) => {
    if(value.acknowledged){
			res.status(201).send(value.insertedId);
		}else{
			globalTools.logToDatabase("function insertLog failed", "error");
			res.status(400).send("Error");
		}
  });
}

// inserts multiple logs to database
// /logs
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/logs
// example body:
// [
//     {
//      "type":"ERROR",
//      "content":"Serce zaczęło działać"
//     },
// {
//      "type":"ERROR",
//      "content":"Serce przestało działać"
// }
//  ]
export function insertMultipleLogs(req: Request, res: Response) {
  const logs = req.body;
  let counter = 0;
  logs.forEach((element: Log) => {
    const log: Log = new Log(element.type, element.content);

    const result = global.insertItem(log, table_name);
    result.then((value) => {
      counter++;
      if(counter == logs.length && value.acknowledged != false) {
        res.status(204).send();
      }else{
				globalTools.logToDatabase("function insertMultipleLogs failed", "error");
				res.status(400).send("Error");
			}
    });
  });
}

// deletes log by id
// /log/{id}
// example:
//  http://localhost:3000/log/6490d3e5982efd2fe9136154
export function deleteLog(req: Request, res: Response) {
  const id = req.params.id;
  const result = global.deleteItemById(id, table_name);
  result.then((value) => {
		if(value.acknowledged){
			res.status(204).send();
		}else{
			globalTools.logToDatabase("function deleteLog failed", "error");
			res.status(400).send("Error");
		}
  });
}

// deletes multiple logs by array of ids
// /logs
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/logs
// example body:
//  ["6490d9efdfd298aad1e8f134",
//  "6490d9f9dfd298aad1e8f135",
//  "6490d9fddfd298aad1e8f136"]

export function deleteMultipleLogs(req: Request, res: Response) {
  const ids = req.body;
  let counter = 0;
  ids.forEach((element: string) => {
    const result = global.deleteItemById(element, table_name);
    result.then((value) => {
      counter++;
      if(counter == ids.length && value.acknowledged != false) {
        res.status(204).send();
      }else{
				globalTools.logToDatabase("function deleteMultipleLogs failed", "error");
				res.status(400).send("Error");
			}
    });
  });
}

// deletes multiple logs by field and value
// /logs/{field}&{value}
// example:
//  http://localhost:3000/logs/published&true
export function deleteLogsByQuery(req: Request, res: Response) {
  const field = req.params.field;
  let value: any; 
	value = req.params.value;

  try {
    value = JSON.parse(value);
  } catch (e: any) {
    value = '"' + value + '"';
    value = JSON.parse(value);
  }

	if(field == 'date'){
		if(typeof value == 'string'){
			value = new Date(value);
		}
	}

  let query = { [field]: value };
  const result = global.deleteItemsByField(query, table_name);
  result.then((value) => {
		if(value.acknowledged){
			res.status(204).send();
		}else{
			globalTools.logToDatabase("function deleteLogsByQuery failed", "error");
			res.status(400).send("Error");
		}
  });
}

// updates log by id with values passed in request body
// /log/{id}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/log/6490d3e5982efd2fe9136154
// example body:
//   {
//      "type":"ERROR",
//      "content":"Serce przestało działać"
// }
export function updateLog(req: Request, res: Response) {
  const id = req.params.id;
  const query = req.body;
	query.date = globalTools.createDateFromString(query.date);
  const result = global.updateItemById(id, table_name, query);
  result.then((value) => {
		if(value.acknowledged){
			res.status(204).send();
		}else{
			globalTools.logToDatabase("function updateLog failed", "error");
			res.status(400).send("Error");
		}
  });
}

// updates multiple logs by array of ids
// /logs
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/logs
// example body:
// {
//     "ids":
//      ["6490d9efdfd298aad1e8f134",
//      "6490d9f9dfd298aad1e8f135",
//      "6490d9fddfd298aad1e8f136"]
//     ,
//     "query":{
//      "type":"ERROR",
//      "content":"Serce przestało działać"
//     }
//  }
export function updateMultipleLogs(req: Request, res: Response) {
  const ids = req.body.ids;
  const updateQuery = req.body.query;
	updateQuery.date = globalTools.createDateFromString(updateQuery.date);
  let counter = 0;
  ids.forEach((element: string) => {
    const result = global.updateItemById(element, table_name, updateQuery);
    result.then((value) => {
      counter++;
      if(counter == ids.length && value.acknowledged != false) {
        res.status(204).send();
      }else{
				globalTools.logToDatabase("function updateMultipleLogs failed", "error");
				res.status(400).send("Error");
			}
    });
  });
}

// updates multiple logs by field and value
// /logs/{field}&{value}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/logs/published&true
// example body:
//   {
//      "type":"ERROR",
//      "content":"Serce przestało działać"
// }
export function updateLogsByQuery(req: Request, res: Response) {
  const field = req.params.field;
  let value: any; 
	value = req.params.value;

	try {
    value = JSON.parse(value);
  } catch (e: any) {
    value = '"' + value + '"';
    value = JSON.parse(value);
  }

	if(field == 'date'){
		if(typeof value == 'string'){
			value = new Date(value);
		}
	}

  const updateQuery = req.body;
	updateQuery.date = globalTools.createDateFromString(updateQuery.date);
  let query = { [field]: JSON.parse(value) };
  const result = global.updateItemsByField(query, table_name, updateQuery);
  result.then((value) => {
		if(value.acknowledged){
			res.status(204).send();
		}else{
			globalTools.logToDatabase("function updateLogsByQuery failed", "error");
			res.status(400).send("Error");
		}
  });
}

// replaces log by id with new log passed in request body
// /log/{id}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/log/6490d3e5982efd2fe9136154
// example body:
//   {
//      "type":"ERROR",
//      "content":"Serce przestało działać",
// }
export function replaceLog(req: Request, res: Response) {
  const id = req.params.id;
  const query = req.body;
  let log: Log;
  log = new Log(query.type, query.content);
  const result = global.replaceItemById(id, table_name, log);
  result.then((value) => {
		if(value.acknowledged){
			res.status(201).send();
		}else{
			globalTools.logToDatabase("function replaceLog failed", "error");
			res.status(400).send("Error");
		}
  });
}

// steals (returns a log, but then deletes it from database) log by id
// /steallog/{id}
// example:
//  http://localhost:3000/steallog/6490d3e5982efd2fe9136154
export function stealLog(req: Request, res: Response) {
  const id = req.params.id;
  const result = global.stealItemById(id, table_name);
  result.then((value) => {
    let log: Log;
    log = new Log(value.value.type, value.value.content, value.value.date);
    res.status(201).send(log);
  });
}
