import { Console } from "console";
import { ObjectId } from "bson";
import express from "express";
import e, { Request, Response } from "express";
import { Note } from "../models/note_model";
import { Rate } from "../enums/rate_enum";
import { NoteRate } from "../models/note-rate_model";
import { User } from "../models/user_model";
import * as global from "../global_database_functions";
import * as globalTools from "../global_tools";
import * as loginService from "../services/login";

const table_name = "notes";

// finds all notes
// /notes
// example:
//  http://localhost:3000/notes
export function getAllNotes(req: Request, res: Response) {
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



// finds note by id
// /note/{id}
// example:
//  http://localhost:3000/note/648c6400e388683aeb23d331
export function getNoteById(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const id = req.params.id;
  const result = global.getItemById(id, table_name);
  let note: Note;
  result.then((value) => {
    note = new Note(
      value.name,
      value.author_id,
      value.category_id,
      value.subcategory_id,
      value.content,
      value.published,
      value.positive_reviews,
      value.negative_reviews,
			value.shared_date,
			value.last_edit_date,
			value._id
    );
    res.send(note);
  });
}

// TODO: Ogarnąć tak, żeby działało bez req.body (wysyłać array w linku?). Aczkolwiek zająć się tym dopiero, jak będzie potrzebne
// finds multiple notes by ids
// /notes TODO: to zmienic
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/notes TODO: to zmienic
// example body:
//  ["6490d9efdfd298aad1e8f134",
//  "6490d9f9dfd298aad1e8f135",
//  "6490d9fddfd298aad1e8f136"]
export function getMultipleNotes(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const ids = req.body;
  console.log(ids);
  let counter = 0;
  const noteArray: Note[] = [];
  ids.forEach((element: string) => {
    const result = global.getItemById(element, table_name);
    result.then((value) => {
      counter++;
      let note = new Note(
        value.name,
        value.author_id,
        value.category_id,
        value.subcategory_id,
        value.content,
        value.published,
        value.positive_reviews,
        value.negative_reviews,
        value.shared_date,
        value.last_edit_date,
				value._id
      );
      noteArray.push(note);
      if (counter == ids.length) {
        res.send(noteArray);
      }
    });
  });
}

// finds multiple notes by field and value
// /notes/{field}&{value}
// example:
//  http://localhost:3000/notes/published&true
export function getNotesByQuery(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const field = req.params.field;
  let value: any; 
	value = req.params.value;

  try {
    value = JSON.parse(value);
  } catch (e: any) {
    value = '"' + value + '"';
    value = JSON.parse(value);
  }

	if(field == 'shared_date' || field == 'last_edit_date'){
		if(typeof value == 'string'){
			value = new Date(value);
		}
	}

  let query = { [field]: value };
  const result = global.getItemsByField(query, table_name);
  const noteArray: Note[] = [];
  let note: Note;
  result.then((value) => {
    value.forEach((element: Note) => {
      note = new Note(
        element.name,
        element.author_id,
        element.category_id,
        element.subcategory_id,
        element.content,
        element.published,
        element.positive_reviews,
        element.negative_reviews,
				element.shared_date,
        element.last_edit_date,
				element._id
      );
      noteArray.push(note);
    });
    res.send(noteArray);
  });
}

// finds multiple notes by id_field and value of objectId
// /notesid/{field}&{value}
// example:
//  http://localhost:3000/notesid/category_id&6490d9efdfd298aad1e8f134
export function getNotesByQueriedId(req: Request, res: Response) {
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
  const noteArray: Note[] = [];
  let note: Note;
  result.then((value) => {
    value.forEach((element: Note) => {
      note = new Note(
        element.name,
        element.author_id,
        element.category_id,
        element.subcategory_id,
        element.content,
        element.published,
        element.positive_reviews,
        element.negative_reviews,
				element.shared_date,
        element.last_edit_date,
				element._id
      );
      noteArray.push(note);
    });
    res.send(noteArray);
  });
}

// inserts note to database
// /note
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/note
// example body:
//   {
//      "name":"custom name",
//      "author_id":"some id",
//      "category_id":"some id",
//      "content":"custom content"
// }
export function insertNote(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const category_id = new ObjectId(req.body.category_id);
  const subcategory_id = new ObjectId(req.body.subcategory_id);
  const author_id = new ObjectId(req.body.author_id);

  const note: Note = new Note(
    req.body.name,
    author_id,
    category_id,
    subcategory_id,
    req.body.content,
    req.body.published,
    req.body.positive_reviews,
    req.body.negative_reviews
  );
  const result = global.insertItem(note, table_name);
  result.then((value) => {
		if(value.acknowledged){
			res.status(201).send(value.insertedId)
		}else{
			globalTools.logToDatabase("function insertNote failed", "error");
			res.status(400).send("Error");
		}
  });
}

// inserts multiple notes to database
// /notes
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/notes
// example body:
// [
//     {
//        "name":"custom name",
//        "content":"custom content",
//        "author_id":"64a49ff9a1caf26fbfaa2dbb",
//        "category_id":"64a4a1d1a1caf26fbfaa2dc1",
//        "sucategory_id":"64a4a367a1caf26fbfaa2dcc",
//        "content":"custom content"
//     },
// {
//    "name":"custom name2",
//    "author_id":"64a49ff9a1caf26fbfaa2dbb",
//    "category_id":"64a4a1d1a1caf26fbfaa2dc1",
//    "sucategory_id":"64a4a367a1caf26fbfaa2dcc",
//    "content":"custom content2"
// }
//  ]
export function insertMultipleNotes(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const notes = req.body;
  let counter = 0;
  let category_id = new ObjectId();
  let subcategory_id = new ObjectId();
  let author_id = new ObjectId();
  notes.forEach((element: Note) => {
    category_id = new ObjectId(element.category_id);
    subcategory_id = new ObjectId(element.subcategory_id);
    author_id = new ObjectId(element.author_id);
    const note: Note = new Note(
      element.name,
      author_id,
      category_id,
      subcategory_id,
      element.content,
      element.published,
      element.positive_reviews,
      element.negative_reviews
    );

    const result = global.insertItem(note, table_name);
    result.then((value) => {
      counter++;
      if(counter == notes.length && value.acknowledged != false) {
        res.status(201).send();
      }else{
				globalTools.logToDatabase("function insertMultipleNotes failed", "error");
				res.status(400).send("Error");
			}
    });
  });
}

// deletes note by id
// /note/{id}
// example:
//  http://localhost:3000/note/6490d3e5982efd2fe9136154
export function deleteNote(req: Request, res: Response) {
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
			globalTools.logToDatabase("function deleteNote failed", "error");
			res.status(400).send("Error");
		}
  });
}

// deletes multiple notes by array of ids
// /notes
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/notes
// example body:
//  ["6490d9efdfd298aad1e8f134",
//  "6490d9f9dfd298aad1e8f135",
//  "6490d9fddfd298aad1e8f136"]

export function deleteMultipleNotes(req: Request, res: Response) {
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
				globalTools.logToDatabase("function deleteMultipleNotes failed", "error");
				res.status(400).send("Error");
			}
    });
  });
}

// deletes multiple notes by field and value
// /notes/{field}&{value}
// example:
//  http://localhost:3000/notes/published&true
export function deleteNotesByQuery(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const field = req.params.field;
  let value: any;
	value = req.params.value;
	
  try {
    value = JSON.parse(value);
  } catch (e: any) {
    value = '"' + value + '"';
    value = JSON.parse(value);
  }

	if(field == 'shared_date' || field == 'last_edit_date'){
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
			globalTools.logToDatabase("function deleteNotesByQuery failed", "error");
			res.status(400).send("Error");
		}
  });
}

// deletes multiple notes by id_field and value of objectId
// /notesid/{field}&{value}
// example:
//  http://localhost:3000/notesid/category_id&6490d9efdfd298aad1e8f134
export function deleteNotesByQueriedId(req: Request, res: Response) {
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
			globalTools.logToDatabase("function deleteNotesByQueriedId failed", "error");
			res.status(400).send("Error");
		}
  });
}

// updates note by id with values passed in request body
// /note/{id}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/note/6490d3e5982efd2fe9136154
// example body:
//   {
//      "name":"custom name",
//      "content":"custom content"
// }
export function updateNote(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const id = req.params.id;
  let query = req.body;
  if (typeof query.category_id !== "undefined") {
    query.category_id = new ObjectId(query.category_id);
  }
  if (typeof query.subcategory_id !== "undefined") {
    query.subcategory_id = new ObjectId(query.subcategory_id);
  }
  if (typeof query.author_id !== "undefined") {
    query.author_id = new ObjectId(query.author_id);
  }	
	if (typeof query._id !== "undefined") {
    query._id = new ObjectId(query._id);
  }
	if (typeof query.shared_date !== "undefined") {
    query.shared_date = globalTools.createDateFromString(query.shared_date);
  }


	query.last_edit_date = new Date();
	
  const result = global.updateItemById(id, table_name, query);
  result.then((value) => {
		if(value.acknowledged){
			res.status(204).send();
		}else{
			globalTools.logToDatabase("function updateNote failed", "error");
			res.status(400).send("Error");
		}
  });
}

// updates multiple notes by array of ids
// /notes
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/notes
// example body:
// {
//     "ids":
//      ["6490d9efdfd298aad1e8f134",
//      "6490d9f9dfd298aad1e8f135",
//      "6490d9fddfd298aad1e8f136"]
//     ,
//     "query":{
//        "name":"custom name",
//        "content":"custom content"
//     }
//  }
export function updateMultipleNotes(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const ids = req.body.ids;
  let updateQuery = req.body.query;
  if (typeof updateQuery.category_id !== "undefined") {
    updateQuery.category_id = new ObjectId(updateQuery.category_id);
  }
  if (typeof updateQuery.subcategory_id !== "undefined") {
    updateQuery.subcategory_id = new ObjectId(updateQuery.subcategory_id);
  }
  if (typeof updateQuery.author_id !== "undefined") {
    updateQuery.author_id = new ObjectId(updateQuery.author_id);
  }
	if (typeof updateQuery._id !== "undefined") {
    updateQuery._id = new ObjectId(updateQuery._id);
  }
	if (typeof updateQuery.shared_date !== "undefined") {
    updateQuery.shared_date = globalTools.createDateFromString(updateQuery.shared_date);
  }

	updateQuery.last_edit_date = new Date();
  let counter = 0;
  ids.forEach((element: string) => {
    const result = global.updateItemById(element, table_name, updateQuery);
    result.then((value) => {
      counter++;
      if(counter == ids.length && value.acknowledged != false) {
        res.status(204).send();
      }else{
				globalTools.logToDatabase("function updateMultipleNotes failed", "error");
				res.status(400).send("Error");
			}
    });
  });
}

// updates multiple notes by field and value
// /notes/{field}&{value}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/notes/published&true
// example body:
//   {
//      "name":"custom name",
//      "content":"custom content"
// }
export function updateNotesByQuery(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const field = req.params.field;
  let value: any;
	value = req.params.value;

  try {
    value = JSON.parse(value);
  } catch (e: any) {
    value = '"' + value + '"';
    value = JSON.parse(value);
  }

	if(field == 'shared_date' || field == 'last_edit_date'){
		if(typeof value == 'string'){
			value = new Date(value);
		}
	}

  let updateQuery = req.body;
  if (typeof updateQuery.category_id !== "undefined") {
    updateQuery.category_id = new ObjectId(updateQuery.category_id);
  }
  if (typeof updateQuery.subcategory_id !== "undefined") {
    updateQuery.subcategory_id = new ObjectId(updateQuery.subcategory_id);
  }
  if (typeof updateQuery.author_id !== "undefined") {
    updateQuery.author_id = new ObjectId(updateQuery.author_id);
  }
	if (typeof updateQuery._id !== "undefined") {
    updateQuery._id = new ObjectId(updateQuery._id);
  }	
	if (typeof updateQuery.shared_date !== "undefined") {
    updateQuery.shared_date = globalTools.createDateFromString(updateQuery.shared_date);
  }

	updateQuery.last_edit_date = new Date();
  let query = { [field]: value };
  const result = global.updateItemsByField(query, table_name, updateQuery);
  result.then((value) => {
		if(value.acknowledged){
			res.status(204).send();
		}else{
			globalTools.logToDatabase("function updateNotesByQuery failed", "error");
			res.status(400).send("Error");
		}
  });
}

// updates multiple notes by id_field and value of objectId
// /notesid/{field}&{value}
// example:
//  http://localhost:3000/notesid/category_id&6490d9efdfd298aad1e8f134
export function updateNotesByQueriedId(req: Request, res: Response) {
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
  if (typeof updateQuery.category_id !== "undefined") {
    updateQuery.category_id = new ObjectId(updateQuery.category_id);
  }
  if (typeof updateQuery.subcategory_id !== "undefined") {
    updateQuery.subcategory_id = new ObjectId(updateQuery.subcategory_id);
  }
  if (typeof updateQuery.author_id !== "undefined") {
    updateQuery.author_id = new ObjectId(updateQuery.author_id);
  }
	if (typeof updateQuery._id !== "undefined") {
    updateQuery._id = new ObjectId(updateQuery._id);
  }
	if (typeof updateQuery.shared_date !== "undefined") {
    updateQuery.shared_date = globalTools.createDateFromString(updateQuery.shared_date);
  }

	updateQuery.last_edit_date = new Date();
  let query = { [field]: objValue };

  const result = global.updateItemsByField(query, table_name, updateQuery);
  result.then((value) => {
		if(value.acknowledged){
			res.status(204).send();
		}else{
			globalTools.logToDatabase("function updateNotesByQueriedId failed", "error");
			res.status(400).send("Error");
		}
  });
}

// replaces note by id with new note passed in request body
// /note/{id}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/note/6490d3e5982efd2fe9136154
// example body:
//   {
//      "name":"custom name",
//      "author_id":"some id",
//      "category_id":"some id",
//      "content":"custom content"
// }
export function replaceNote(req: Request, res: Response) {
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

  let note: Note;
  note = new Note(
    query.name,
    query.author_id,
    query.category_id,
    query.subcategory_id,
    query.content,
    query.published,
    query.positive_reviews,
    query.negative_reviews,
		query._id
  );
  const result = global.replaceItemById(id, table_name, note);
  result.then((value) => {
		if(value.acknowledged){
			res.status(201).send();
		}else{
			globalTools.logToDatabase("function replaceNote failed", "error");
			res.status(400).send("Error");
		}
  });
}

// steals (returns a note, but then deletes it from database) note by id
// /stealnote/{id}
// example:
//  http://localhost:3000/stealnote/6490d3e5982efd2fe9136154
export function stealNote(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const id = req.params.id;
  const result = global.stealItemById(id, table_name);
  result.then((value) => {
    let note: Note;
    note = new Note(
      value.value.name,
      value.value.author_id,
      value.value.category_id,
      value.value.subcategory_id,
      value.value.content,
      value.value.published,
      value.value.positive_reviews,
      value.value.negative_reviews,
			value.value.shared_date,
      value.value.last_edit_date,
			value.value._id
    );
    res.status(201).send(note);
  });
}

// adds user's rate to note (and updates user's rated_notes array)
// /ratenote/id
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/ratenote/6490d3e5982efd2fe9136154
// example body:
//   {
//      "user_id":"some id",
// 			"rate":"positive"
// }
export function rateNote(req: Request, res: Response) {
	// const authData = req.headers.authorization;
	// const token = authData?.split(' ')[1] ?? '';
	// if(!loginService.checkIfLogged(token)){
	// 	res.status(401).send("Error - unauthorized");
	// 	return false;
	// }

	const id = req.params.id;
  let query = req.body;
	let user_id = new ObjectId(query.user_id); 
	let note_id = new ObjectId(id);
  let note: Note;
	let user: User;
	let alreadyRated: boolean = false;
	let oldRate: Rate;
	let noteRate: NoteRate;

	let rateQuery = { ["user_id"]: user_id, ["note_id"]: note_id};
	const getNoteRateResult = global.getItemsByField(rateQuery, "note-rates");

	const getUserResult = global.getItemById(query.user_id, "users");

	getUserResult.then((value) => {
		user = new User(
      value.login,
      value.avatar_url,
      value.email,
      value.password,
			value.role,
      value.active,
			value.untrusted,
			value.saved_notes,
			value.followed_users,
			value.blocked_users,
			value.created,
			value._id
    );
		getNoteRateResult.then((value: NoteRate[]) => {		
			if(value.length != 0){
				alreadyRated = true;
				oldRate = value[0].rate;
				noteRate = value[0];
			}

			const getNoteResult = global.getItemById(id, table_name);

			getNoteResult.then((value) => {
				note = new Note(
					value.name,
					value.author_id,
					value.category_id,
					value.subcategory_id,
					value.content,
					value.published,
					value.positive_reviews,
					value.negative_reviews,
					value.shared_date,
					value.last_edit_date,
					value._id
				);

				
				if(typeof note.positive_reviews == "undefined"){
					note.positive_reviews = 0;
				}
				if(typeof note.negative_reviews == "undefined"){
					note.negative_reviews = 0;
				}

				if(alreadyRated == true){

					if(query.rate == oldRate){
						if(query.rate == "positive"){
							note.positive_reviews--;
							// TODO: wymyślić co zrobić, żeby nie musieć używać tego if'a?
							if(typeof noteRate._id !== "undefined"){
								let dResult = global.deleteItemById(noteRate._id.toString(), "note-rates");
							}
							
						}else if(query.rate == "negative"){
							note.negative_reviews--;
							if(typeof noteRate._id !== "undefined"){
								let dResult = global.deleteItemById(noteRate._id.toString(), "note-rates");
							}
						}
					}else{
						if(query.rate == "positive"){
							note.positive_reviews++;
							note.negative_reviews--;
							if(typeof noteRate._id !== "undefined"){
								let uResult = global.updateItemById(noteRate._id.toString(), "note-rates", {["rate"]:"positive"});
							}
						}else if(query.rate == "negative"){
							note.negative_reviews++;
							note.positive_reviews--;
							if(typeof noteRate._id !== "undefined"){
								let uResult = global.updateItemById(noteRate._id.toString(), "note-rates", {["rate"]:"negative"});
							}
						}
					}
					// TODO: szukamy oceny usera w jego tabeli rated_notes i ją zmieniamy (XD!)
				}else{

					if(query.rate == "positive"){
						note.positive_reviews++;
					}else if(query.rate == "negative"){
						note.negative_reviews++;
					}
					noteRate = new NoteRate(query.rate, note_id, user_id);
					let iResult = global.insertItem(noteRate, "note-rates");

				}
				

				const updateResult = global.updateItemById(id, table_name, note);
				updateResult.then((value) => {
					

					// let noteRate: NoteRate = new NoteRate(query.rate, note_id, user_id);
					// //TODO: prezmyslec czy to co ponizej ma sens i nie bedzie robic syfu jesli jest juz ocenione wczesniej
					// user.rated_notes.push(noteRate); 

					// const userUpdateResult = global.updateItemById(query.user_id, "users", user);
					// userUpdateResult.then((value) => {
						if(value.acknowledged){
						res.status(204).send();
					}else{
						globalTools.logToDatabase("function rateNote failed", "error");
						res.status(400).send("Error");
					}
					// });
				});

			});
		});
	});
}
