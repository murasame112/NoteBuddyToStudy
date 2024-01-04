import { Console } from "console";
import { ObjectId } from "bson";
import express from "express";
import e, { Request, Response } from "express";
import { NoteRate } from "../models/note-rate_model";
import * as global from "../global_database_functions";
import * as globalTools from "../global_tools";
import * as loginService from "../services/login"

const table_name = "noteRates";

// finds all noteRates
// /noteRates
// example:
//  http://localhost:3000/noteRates
export function getAllNoteRates(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const result = global.getAllItems(table_name);
  result.then((value) => {
    res.send(value);
  });
}

// finds noteRate by id
// /noteRate/{id}
// example:
//  http://localhost:3000/noteRate/648c6400e388683aeb23d331
export function getNoteRateById(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const id = req.params.id;
  const result = global.getItemById(id, table_name);
  let noteRate: NoteRate;
  result.then((value) => {
    noteRate = new NoteRate(
      value.rate,
			value.note_id,
			value.user_id,
			value._id
    );
    res.send(noteRate);
  });
}

// finds multiple noteRates by field and value
// /noteRates/{field}&{value}
// example:
//  http://localhost:3000/noteRates/published&true
export function getNoteRatesByQuery(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const field = req.params.field;
  let value = req.params.value;
  try {
    value = JSON.parse(value);
  } catch (e: any) {
    value = '"' + value + '"';
    value = JSON.parse(value);
  }
  let query = { [field]: value };
  const result = global.getItemsByField(query, table_name);
  const noteRateArray: NoteRate[] = [];
  let noteRate: NoteRate;
  result.then((value) => {
    value.forEach((element: NoteRate) => {
      noteRate = new NoteRate(element.rate, element.note_id, element.user_id, element._id);
      noteRateArray.push(noteRate);
    });
    res.send(noteRateArray);
  });
}

// finds multiple noteRates by id_field and value of objectId
// /noteRatesid/{field}&{value}
// example:
//  http://localhost:3000/noteRatesid/note&6490d9efdfd298aad1e8f134
export function getNoteRatesByQueriedId(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const field = req.params.field;
  const value = req.params.value;
  const objValue = new ObjectId(value);

  let query = { [field]: objValue };
  const result = global.getItemsByField(query, table_name);
  const noteRateArray: NoteRate[] = [];
  let noteRate: NoteRate;
  result.then((value) => {
    value.forEach((element: NoteRate) => {
      noteRate = new NoteRate(element.rate, element.note_id, element.user_id, element._id);
      noteRateArray.push(noteRate);
    });
    res.send(noteRateArray);
  });
}

// inserts noteRate to database
// /noteRate
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/noteRate
// example body:
//   {
//      "rate":"positive",
//      "user_id":"some id",
//			"note_id":"some id"
// }
export function insertNoteRate(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
	const note_id = new ObjectId(req.body.note_id);
  const user_id = new ObjectId(req.body.user_id);
  const noteRate: NoteRate = new NoteRate(req.body.rate, note_id, user_id);
  const result = global.insertItem(noteRate, table_name);
  result.then((value) => {
    if(value.acknowledged){
			res.status(201).send(value.insertedId);
		}else{
			globalTools.logToDatabase("function insertNoteRate failed", "error");
			res.status(400).send("Error");
		}
  });
}

// inserts multiple noteRates to database
// /noteRates
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/noteRates
// example body:
// [
//     {
//      "rate":"positive",
//      "user_id":"some id",
//			"note_id":"some id"
//     },
// {
//      "rate":"positive",
//      "user_id":"some id2",
//			"note_id":"some id2"
// }
//  ]
export function insertMultipleNoteRates(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const noteRates = req.body;
  let counter = 0;
  let note_id = new ObjectId();
	let user_id = new ObjectId();
  noteRates.forEach((element: NoteRate) => {
    note_id = new ObjectId(element.note_id);
		user_id = new ObjectId(element.user_id);
    const noteRate: NoteRate = new NoteRate(element.rate, note_id, user_id);

    const result = global.insertItem(noteRate, table_name);
    result.then((value) => {
      counter++;
      if(counter == noteRates.length && value.acknowledged != false) {
        res.status(201).send();
      }else{
				globalTools.logToDatabase("function insertMultipleNoteRates failed", "error");
				res.status(400).send("Error");
			}
    });
  });
}

// deletes noteRate by id
// /noteRate/{id}
// example:
//  http://localhost:3000/noteRate/6490d3e5982efd2fe9136154
export function deleteNoteRate(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const id = req.params.id;
  const result = global.deleteItemById(id, table_name);
  result.then((value) => {
		if(value.acknowledged){
			res.status(204).send();
		}else{
			globalTools.logToDatabase("function deleteNoteRate failed", "error");
			res.status(400).send("Error");
		}
  });
}

// deletes multiple noteRates by array of ids
// /noteRates
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/noteRates
// example body:
//  ["6490d9efdfd298aad1e8f134",
//  "6490d9f9dfd298aad1e8f135",
//  "6490d9fddfd298aad1e8f136"]

export function deleteMultipleNoteRates(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const ids = req.body;
  let counter = 0;
  ids.forEach((element: string) => {
    const result = global.deleteItemById(element, table_name);
    result.then((value) => {
      counter++;
      if(counter == ids.length && value.acknowledged != false) {
        res.status(204).send();
      }else{
				globalTools.logToDatabase("function deleteMultipleNoteRates failed", "error");
				res.status(400).send("Error");
			}
    });
  });
}

// deletes multiple noteRates by field and value
// /noteRates/{field}&{value}
// example:
//  http://localhost:3000/noteRates/published&true
export function deleteNoteRatesByQuery(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const field = req.params.field;
  let value = req.params.value;
  try {
    value = JSON.parse(value);
  } catch (e: any) {
    value = '"' + value + '"';
    value = JSON.parse(value);
  }
  let query = { [field]: value };
  const result = global.deleteItemsByField(query, table_name);
  result.then((value) => {
		if(value.acknowledged){
			res.status(204).send();
		}else{
			globalTools.logToDatabase("function deleteNoteRatesByQuery failed", "error");
			res.status(400).send("Error");
		}
  });
}

// deletes multiple noteRates by id_field and value of objectId
// /noteRatesid/{field}&{value}
// example:
//  http://localhost:3000/noteRatesid/user_id&6490d9efdfd298aad1e8f134
export function deleteNoteRatesByQueriedId(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const field = req.params.field;
  const value = req.params.value;
  const objValue = new ObjectId(value);

  let query = { [field]: objValue };
  const result = global.deleteItemsByField(query, table_name);
  result.then((value) => {
		if(value.acknowledged){
			res.status(204).send();
		}else{
			globalTools.logToDatabase("function deleteNoteRatesByQueriedId failed", "error");
			res.status(400).send("Error");
		}
  });
}

// updates noteRate by id with values passed in request body
// /noteRate/{id}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/noteRate/6490d3e5982efd2fe9136154
// example body:
//   {
//      "rate":"positive"
// }
export function updateNoteRate(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const id = req.params.id;
  let query = req.body;
  if (typeof query.user_id !== "undefined") {
    query.user_id = new ObjectId(query.user_id);
  }
	if (typeof query.note_id !== "undefined") {
    query.note_id = new ObjectId(query.note_id);
  }
	if (typeof query._id !== "undefined") {
    query._id = new ObjectId(query._id);
  }
  const result = global.updateItemById(id, table_name, query);
  result.then((value) => {
		if(value.acknowledged){
			res.status(204).send();
		}else{
			globalTools.logToDatabase("function updateNoteRate failed", "error");
			res.status(400).send("Error");
		}
  });
}

// updates multiple noteRates by array of ids
// /noteRates
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/noteRates
// example body:
// {
//     "ids":
//      ["6490d9efdfd298aad1e8f134",
//      "6490d9f9dfd298aad1e8f135",
//      "6490d9fddfd298aad1e8f136"]
//     ,
//     "query":{
//        "rate":"positive"
//     }
//  }
export function updateMultipleNoteRates(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const ids = req.body.ids;
  let updateQuery = req.body.query;
	if (typeof updateQuery.user_id !== "undefined") {
    updateQuery.user_id = new ObjectId(updateQuery.user_id);
  }
	if (typeof updateQuery.note_id !== "undefined") {
    updateQuery.note_id = new ObjectId(updateQuery.note_id);
  }
	if (typeof updateQuery._id !== "undefined") {
    updateQuery._id = new ObjectId(updateQuery._id);
  }
  let counter = 0;
  ids.forEach((element: string) => {
    const result = global.updateItemById(element, table_name, updateQuery);
    result.then((value) => {
      counter++;
      if(counter == ids.length && value.acknowledged != false) {
        res.status(204).send();
      }else{
				globalTools.logToDatabase("function updateMultipleNoteRates failed", "error");
				res.status(400).send("Error");
			}
    });
  });
}

// updates multiple noteRates by field and value
// /noteRates/{field}&{value}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/noteRates/published&true
// example body:
//   {
//      "rate":"positive"
// }
export function updateNoteRatesByQuery(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const field = req.params.field;
  let value = req.params.value;

  try {
    value = JSON.parse(value);
  } catch (e: any) {
    value = '"' + value + '"';
    value = JSON.parse(value);
  }
	
  let updateQuery = req.body;
  if (typeof updateQuery.user_id !== "undefined") {
    updateQuery.user_id = new ObjectId(updateQuery.user_id);
  }
	if (typeof updateQuery.note_id !== "undefined") {
    updateQuery.note_id = new ObjectId(updateQuery.note_id);
  }
	if (typeof updateQuery._id !== "undefined") {
    updateQuery._id = new ObjectId(updateQuery._id);
  }
  let query = { [field]: value };
  const result = global.updateItemsByField(query, table_name, updateQuery);
  result.then((value) => {
		if(value.acknowledged){
			res.status(204).send();
		}else{
			globalTools.logToDatabase("function updateNoteRatesByQuery failed", "error");
			res.status(400).send("Error");
		}
  });
}

// updates multiple noteRates by id_field and value of objectId
// /noteRatesid/{field}&{value}
// example:
//  http://localhost:3000/noteRatesid/user_id&6490d9efdfd298aad1e8f134
export function updateNoteRatesByQueriedId(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const field = req.params.field;
  let value = req.params.value;
  const objValue = new ObjectId(value);

  let updateQuery = req.body;
  if (typeof updateQuery.user_id !== "undefined") {
    updateQuery.user_id = new ObjectId(updateQuery.user_id);
  }
	if (typeof updateQuery.note_id !== "undefined") {
    updateQuery.note_id = new ObjectId(updateQuery.note_id);
  }
	if (typeof updateQuery._id !== "undefined") {
    updateQuery._id = new ObjectId(updateQuery._id);
  }
  let query = { [field]: objValue };

  const result = global.updateItemsByField(query, table_name, updateQuery);
  result.then((value) => {
		if(value.acknowledged){
			res.status(204).send();
		}else{
			globalTools.logToDatabase("function updateNoteRatesByQueriedId failed", "error");
			res.status(400).send("Error");
		}
  });
}


// replaces noteRate by id with new noteRate passed in request body
// /noteRate/{id}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/noterate/6490d3e5982efd2fe9136154
// example body:
//   {
//      "rate":"positive",
//      "user_id":"some id",
//			"note_id":"some id"
// }
export function replaceNoteRate(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const id = req.params.id;
  const query = req.body;

	if (typeof query._id !== "undefined") {
    query._id = new ObjectId(query._id);
  }else{
		query._id = new ObjectId(id);
	}

  let noteRate: NoteRate;
  noteRate = new NoteRate(query.rate, query.note_id, query.user_id, query._id);
  const result = global.replaceItemById(id, table_name, noteRate);
  result.then((value) => {
		if(value.acknowledged){
			res.status(201).send();
		}else{
			globalTools.logToDatabase("function replaceNoteRate failed", "error");
			res.status(400).send("Error");
		}
  });
}

// steals (returns a noteRate, but then deletes it from database) noteRate by id
// /stealnoteRate/{id}
// example:
//  http://localhost:3000/stealnoterate/6490d3e5982efd2fe9136154
export function stealNoteRate(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const id = req.params.id;
  const result = global.stealItemById(id, table_name);
  result.then((value) => {
    let noteRate: NoteRate;
    noteRate = new NoteRate(value.value.rate, value.value.note_id, value.value.user_id, value.value._id);
    res.status(201).send(noteRate);
  });
}
