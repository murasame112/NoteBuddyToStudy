import { Console } from "console";
import { ObjectId } from "bson";
import express from "express";
import e, { Request, Response } from "express";
import { User } from "../models/user_model";
import * as global from "../global_database_functions";
import { Role } from "../enums/role_enum";
import { Rate } from "../enums/rate_enum";
import { NoteRate } from "../models/note-rate_model";
import * as loginService from "../services/login";
import * as globalTools from "../global_tools";

const table_name = "users";


// finds all users
// /users
// example:
//  http://localhost:3000/users
export function getAllUsers(req: Request, res: Response) {
  const result = global.getAllItems(table_name);
  result.then((value) => {
    res.send(value);
  });
}

// finds user by id
// /user/{id}
// example:
//  http://localhost:3000/user/648c6400e388683aeb23d331
export function getUserById(req: Request, res: Response) {
  const id = req.params.id;
  const result = global.getItemById(id, table_name);
  let user: User;
  result.then((value) => {
    user = new User(
      value.login,
      value.avatar_url,
      value.email,
      value.password,
			value.role,
      value.active,
			value.untrusted,
			value.saved_notes,
			value.rated_notes,
			value.followed_users,
			value.blocked_users,
			value.created,
			value._id
    );
    res.send(user);
  });
}

// finds multiple users by field and value
// /users/{field}&{value}
// example:
//  http://localhost:3000/users/published&true
export function getUsersByQuery(req: Request, res: Response) {
  const field = req.params.field;
  let value: any;
	value = req.params.value;
	
  try {
    value = JSON.parse(value);
  } catch (e: any) {
    value = '"' + value + '"';
    value = JSON.parse(value);
  }

	if(field == 'created'){
		if(typeof value == 'string'){
			value = new Date(value);
		}
	}

  let query = { [field]: value };
  const result = global.getItemsByField(query, table_name);
  const userArray: User[] = [];
  let user: User;
  result.then((value) => {
    value.forEach((element: User) => {
      user = new User(
        element.login,
        element.avatar_url,
        element.email,
        element.password,
				element.role,
        element.active,
				element.untrusted,
				element.saved_notes,
				element.rated_notes,
				element.followed_users,
				element.blocked_users,
				element.created,
				element._id
      );
      userArray.push(user);
    });
    res.send(userArray);
  });
}

// finds multiple users by id_field and value of objectId
// /usersid/{field}&{value}
// example:
//  http://localhost:3000/usersid/note&6490d9efdfd298aad1e8f134
export function getUsersByQueriedId(req: Request, res: Response) {
  const field = req.params.field;
  const value = req.params.value;
  const objValue = new ObjectId(value);

  let query = { [field]: objValue };
  const result = global.getItemsByField(query, table_name);
  const userArray: User[] = [];
  let user: User;
  result.then((value) => {
    value.forEach((element: User) => {
      user = new User(
        element.login,
        element.avatar_url,
        element.email,
        element.password,
				element.role,
        element.active,
				element.untrusted,
				element.saved_notes,
				element.rated_notes,
				element.followed_users,
				element.blocked_users,
				element.created,
				element._id
      );
      userArray.push(user);
    });
    res.send(userArray);
  });
}

// inserts user to database
// /user
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/user
// example body:
//   {
//      "login":"custom login",
//      "avatar_url":"custom url",
//      "email":"custom email",
//      "password":"custom password",
// 			"role":"user"
// }
export function insertUser(req: Request, res: Response) {

	loginService.checkIfUserExists(req.body.login).then((value) => {
		if(value == true){
			res.status(400).send("Error - user already exists");
			return false;
		}
		const user: User = new User(
			req.body.login,
			req.body.avatar_url,
			req.body.email,
			loginService.hashPassword(req.body.password),
			req.body.role,
		);
		const result = global.insertItem(user, table_name);
		result.then((value) => {
			if(value.acknowledged){
				res.status(201).send(value.insertedId);
			}else{
				globalTools.logToDatabase("function insertUser failed", "error");
				res.status(400).send("Error");
			}
		});

	});
  
}

// inserts multiple users to database
// /users
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/users
// example body:
// [
//     {
    //  "login":"custom login",
    //  "avatar_url":"custom url",
    //  "email":"custom email",
    //  "password":"custom password",
		// 	"role":"user",
    //  "active":true,
//     },
// {
    //  "login":"custom login",
    //  "avatar_url":"custom url",
    //  "email":"custom email",
    //  "password":"custom password",
		// 	"role":"user",
    //  "active":true
// }
//  ]
export function insertMultipleUsers(req: Request, res: Response) {
  const users = req.body;
  let counter = 0;
  users.forEach((element: User) => {
    const user: User = new User(
      element.login,
      element.avatar_url,
      element.email,
      loginService.hashPassword(element.password),
			element.role,
    );

    const result = global.insertItem(user, table_name);
    result.then((value) => {
      counter++;
      if(counter == users.length && value.acknowledged != false) {
        res.status(201).send();
      }else{
				globalTools.logToDatabase("function insertMultipleUsers failed", "error");
				res.status(400).send("Error");
			}
    });
  });
}

// deletes user by id
// /user/{id}
// example:
//  http://localhost:3000/user/6490d3e5982efd2fe9136154
export function deleteUser(req: Request, res: Response) {
  const id = req.params.id;
  const result = global.deleteItemById(id, table_name);
  result.then((value) => {
		if(value.acknowledged){
			res.status(204).send();
		}else{
			globalTools.logToDatabase("function deleteUser failed", "error");
			res.status(400).send("Error");
		}
  });
}

// deletes multiple users by array of ids
// /users
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/users
// example body:
//  ["6490d9efdfd298aad1e8f134",
//  "6490d9f9dfd298aad1e8f135",
//  "6490d9fddfd298aad1e8f136"]

export function deleteMultipleUsers(req: Request, res: Response) {
  const ids = req.body;
  let counter = 0;
  ids.forEach((element: string) => {
    const result = global.deleteItemById(element, table_name);
    result.then((value) => {
      counter++;
      if(counter == ids.length && value.acknowledged != false) {
        res.status(204).send();
      }else{
				globalTools.logToDatabase("function deleteMultipleUsers failed", "error");
				res.status(400).send("Error");
			}
    });
  });
}

// deletes multiple users by field and value
// /users/{field}&{value}
// example:
//  http://localhost:3000/users/published&true
export function deleteUsersByQuery(req: Request, res: Response) {
  const field = req.params.field;
  let value: any;
	value = req.params.value;

  try {
    value = JSON.parse(value);
  } catch (e: any) {
    value = '"' + value + '"';
    value = JSON.parse(value);
  }

	if(field == 'created'){
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
			globalTools.logToDatabase("function deleteUsersByQuery failed", "error");
			res.status(400).send("Error");
		}
  });
}

// deletes multiple users by id_field and value of objectId
// /usersid/{field}&{value}
// example:
//  http://localhost:3000/usersid/followed_users&64a49ff9a1caf26fbfaa2dbb
export function deleteUsersByQueriedId(req: Request, res: Response) {
  const field = req.params.field;
  const value = req.params.value;
  const objValue = new ObjectId(value);

  let query = { [field]: objValue };
  const result = global.deleteItemsByField(query, table_name);
  result.then((value) => {
		if(value.acknowledged){
			res.status(204).send();
		}else{
			globalTools.logToDatabase("function deleteUsersByQueriedId failed", "error");
			res.status(400).send("Error");
		}
  });
}

// updates user by id with values passed in request body
// /user/{id}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/user/6490d3e5982efd2fe9136154
// example body:
//   {
//      "login":"custom login"
// }
export function updateUser(req: Request, res: Response) {
  const id = req.params.id;
  const query = req.body;

	if (typeof query._id !== "undefined") {
    query._id = new ObjectId(query._id);
  }

	let note_id: ObjectId;
	if (typeof query.saved_notes !== "undefined") {
    let notesIds: ObjectId[] = [];
    query.saved_notes.forEach((elem: string) => {
      note_id = new ObjectId(elem);
      notesIds.push(note_id);
    });
    query.saved_notes = notesIds;
  }

	let rated_note_id: ObjectId;
	let rate: Rate;
	if (typeof query.rated_notes !== "undefined") {
    let ratedNotes: NoteRate[] = [];
    query.rated_notes.forEach((elem: NoteRate) => {
      rated_note_id = new ObjectId(elem.note_id);
			rate = elem.rate;

      ratedNotes.push(new NoteRate(rate, rated_note_id));
    });
    query.rated_notes = ratedNotes;
  }

	if(typeof query.password !== "undefined"){
		query.password = loginService.hashPassword(query.password);
	}
	
	let user_id: ObjectId;
	if (typeof query.followed_users !== "undefined") {
    let usersIds: ObjectId[] = [];

		
    query.followed_users.forEach((elem: string) => {
      user_id = new ObjectId(elem);
      usersIds.push(user_id);
    });

    query.followed_users = usersIds;
  }

	if (typeof query.blocked_users !== "undefined") {
    let usersIds: ObjectId[] = [];

    query.blocked_users.forEach((elem: string) => {
      user_id = new ObjectId(elem);
      usersIds.push(user_id);
    });

    query.blocked_users = usersIds;
  }

	query.created = globalTools.createDateFromString(query.created);
  const result = global.updateItemById(id, table_name, query);
  result.then((value) => {
		if(value.acknowledged){
			res.status(204).send();
		}else{
			globalTools.logToDatabase("function updateUser failed", "error");
			res.status(400).send("Error");
		}
  });
}

// updates multiple users by array of ids
// /users
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/users
// example body:
// {
//     "ids":
//      ["6490d9efdfd298aad1e8f134",
//      "6490d9f9dfd298aad1e8f135",
//      "6490d9fddfd298aad1e8f136"]
//     ,
//     "query":{
//        "login":"custom login"
//     }
//  }
export function updateMultipleUsers(req: Request, res: Response) {
  const ids = req.body.ids;
  const updateQuery = req.body.query;
	if (typeof updateQuery._id !== "undefined") {
    updateQuery._id = new ObjectId(updateQuery._id);
  }


	let note_id: ObjectId;
	if (typeof updateQuery.saved_notes !== "undefined") {
    let notesIds: ObjectId[] = [];
    updateQuery.saved_notes.forEach((elem: string) => {
      note_id = new ObjectId(elem);
      notesIds.push(note_id);
    });
    updateQuery.saved_notes = notesIds;
  }

	let rated_note_id: ObjectId;
	let rate: Rate;
	if (typeof updateQuery.rated_notes !== "undefined") {
    let ratedNotes: NoteRate[] = [];
    updateQuery.rated_notes.forEach((elem: NoteRate) => {
      rated_note_id = new ObjectId(elem.note_id);
			rate = elem.rate;

      ratedNotes.push(new NoteRate(rate, rated_note_id));
    });
    updateQuery.rated_notes = ratedNotes;
  }

	if(typeof updateQuery.password !== "undefined"){
		updateQuery.password = loginService.hashPassword(updateQuery.password);
	}
	
	let user_id: ObjectId;
	if (typeof updateQuery.followed_users !== "undefined") {
    let usersIds: ObjectId[] = [];

		
    updateQuery.followed_users.forEach((elem: string) => {
      user_id = new ObjectId(elem);
      usersIds.push(user_id);
    });

    updateQuery.followed_users = usersIds;
  }

	if (typeof updateQuery.blocked_users !== "undefined") {
    let usersIds: ObjectId[] = [];

    updateQuery.blocked_users.forEach((elem: string) => {
      user_id = new ObjectId(elem);
      usersIds.push(user_id);
    });

    updateQuery.blocked = usersIds;
  }

	updateQuery.created = globalTools.createDateFromString(updateQuery.created);
  let counter = 0;
  ids.forEach((element: string) => {
    const result = global.updateItemById(element, table_name, updateQuery);
    result.then((value) => {
      counter++;
      if(counter == ids.length && value.acknowledged != false) {
        res.status(204).send();
      }else{
				globalTools.logToDatabase("function updateMultipleUsers failed", "error");
				res.status(400).send("Error");
			}
    });
  });
}

// updates multiple users by field and value
// /users/{field}&{value}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/users/active&true
// example body:
//   {
//      "login":"custom login"
// }
export function updateUsersByQuery(req: Request, res: Response) {
  const field = req.params.field;
  let value: any;
	value = req.params.value;

	try {
    value = JSON.parse(value);
  } catch (e: any) {
    value = '"' + value + '"';
    value = JSON.parse(value);
  }

	if(field == 'created'){
		if(typeof value == 'string'){
			value = new Date(value);
		}
	}

  const updateQuery = req.body;
	if (typeof updateQuery._id !== "undefined") {
    updateQuery._id = new ObjectId(updateQuery._id);
  }

	let note_id: ObjectId;
	if (typeof updateQuery.saved_notes !== "undefined") {
    let notesIds: ObjectId[] = [];
    updateQuery.saved_notes.forEach((elem: string) => {
      note_id = new ObjectId(elem);
      notesIds.push(note_id);
    });
    updateQuery.saved_notes = notesIds;
  }

	let rated_note_id: ObjectId;
	let rate: Rate;
	if (typeof updateQuery.rated_notes !== "undefined") {
    let ratedNotes: NoteRate[] = [];
    updateQuery.rated_notes.forEach((elem: NoteRate) => {
      rated_note_id = new ObjectId(elem.note_id);
			rate = elem.rate;

      ratedNotes.push(new NoteRate(rate, rated_note_id));
    });
    updateQuery.rated_notes = ratedNotes;
  }

	if(typeof updateQuery.password !== "undefined"){
		updateQuery.password = loginService.hashPassword(updateQuery.password);
	}
	
	let user_id: ObjectId;
	if (typeof updateQuery.followed_users !== "undefined") {
    let usersIds: ObjectId[] = [];

		
    updateQuery.followed_users.forEach((elem: string) => {
      user_id = new ObjectId(elem);
      usersIds.push(user_id);
    });

    updateQuery.followed_users = usersIds;
  }

	if (typeof updateQuery.blocked_users !== "undefined") {
    let usersIds: ObjectId[] = [];

    updateQuery.blocked_users.forEach((elem: string) => {
      user_id = new ObjectId(elem);
      usersIds.push(user_id);
    });

    updateQuery.blocked = usersIds;
  }

	updateQuery.created = globalTools.createDateFromString(updateQuery.created);
  let query = { [field]: JSON.parse(value) };
  const result = global.updateItemsByField(query, table_name, updateQuery);
  result.then((value) => {
		if(value.acknowledged){
			res.status(204).send();
		}else{
			globalTools.logToDatabase("function updateUsersByQuery failed", "error");
			res.status(400).send("Error");
		}
  });
}

// updates multiple users by id_field and value of objectId
// /usersid/{field}&{value}
// example:
//  http://localhost:3000/usersid/followed_users&64a49ff9a1caf26fbfaa2dbb
// example body:
//   {
//      "login":"custom login"
// }
export function updateUsersByQueriedId(req: Request, res: Response) {
  const field = req.params.field;
  let value = req.params.value;
  const objValue = new ObjectId(value);

  let updateQuery = req.body;
	if (typeof updateQuery._id !== "undefined") {
    updateQuery._id = new ObjectId(updateQuery._id);
  }

	let note_id: ObjectId;
	if (typeof updateQuery.saved_notes !== "undefined") {
    let notesIds: ObjectId[] = [];
    updateQuery.saved_notes.forEach((elem: string) => {
      note_id = new ObjectId(elem);
      notesIds.push(note_id);
    });
    updateQuery.saved_notes = notesIds;
  }

	let rated_note_id: ObjectId;
	let rate: Rate;
	if (typeof updateQuery.rated_notes !== "undefined") {
    let ratedNotes: NoteRate[] = [];
    updateQuery.rated_notes.forEach((elem: NoteRate) => {
      rated_note_id = new ObjectId(elem.note_id);
			rate = elem.rate;

      ratedNotes.push(new NoteRate(rate, rated_note_id));
    });
    updateQuery.rated_notes = ratedNotes;
  }

	if(typeof updateQuery.password !== "undefined"){
		updateQuery.password = loginService.hashPassword(updateQuery.password);
	}

	let user_id: ObjectId;
	if (typeof updateQuery.followed_users !== "undefined") {
    let usersIds: ObjectId[] = [];

		
    updateQuery.followed_users.forEach((elem: string) => {
      user_id = new ObjectId(elem);
      usersIds.push(user_id);
    });

    updateQuery.followed_users = usersIds;
  }

	if (typeof updateQuery.blocked_users !== "undefined") {
    let usersIds: ObjectId[] = [];

    updateQuery.blocked_users.forEach((elem: string) => {
      user_id = new ObjectId(elem);
      usersIds.push(user_id);
    });

    updateQuery.blocked = usersIds;
  }



  updateQuery.created = globalTools.createDateFromString(updateQuery.created);
  let query = { [field]: objValue };

  const result = global.updateItemsByField(query, table_name, updateQuery);
  result.then((value) => {
		if(value.acknowledged){
			res.status(204).send();
		}else{
			globalTools.logToDatabase("function updateUsersByQueriedId failed", "error");
			res.status(400).send("Error");
		}
  });
}

// replaces user by id with new user passed in request body
// /user/{id}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/user/6490d3e5982efd2fe9136154
// example body:
//   {
    //  "login":"custom login",
    //  "avatar_url":"custom url",
    //  "email":"custom email",
    //  "password":"custom password",
		// 	"role":"user",
    //  "active":true
// }
export function replaceUser(req: Request, res: Response) {
  const id = req.params.id;
  const query = req.body;

	if (typeof query._id !== "undefined") {
    query._id = new ObjectId(query._id);
  }else{
		query._id = new ObjectId(id);
	}

  let user: User;
  user = new User(
    query.login,
    query.avatar_url,
    query.email,
    loginService.hashPassword(query.password),
		query.role,
    query.active,
		query.untrusted,
		query.saved_notes,
		query.rated_notes,
		query.followed_users,
		query.blocked_users,
		query._id
  );
  const result = global.replaceItemById(id, table_name, user);
  result.then((value) => {
		if(value.acknowledged){
			res.status(201).send();
		}else{
			globalTools.logToDatabase("function replaceUser failed", "error");
			res.status(400).send("Error");
		}
  });
}

// steals (returns a user, but then deletes it from database) user by id
// /stealuser/{id}
// example:
//  http://localhost:3000/stealuser/6490d3e5982efd2fe9136154
export function stealUser(req: Request, res: Response) {
  const id = req.params.id;
  const result = global.stealItemById(id, table_name);
  result.then((value) => {
    let user: User;
    user = new User(
      value.value.login,
      value.value.avatar_url,
      value.value.email,
      value.value.password,
			value.value.role,
      value.value.active,
			value.value.untrusted,
			value.value.saved_notes,
			value.value.rated_notes,
			value.value.followed_users,
			value.value.blocked_users,
			value.value.created,
			value.value._id
    );
    res.status(201).send(user);
  });
}