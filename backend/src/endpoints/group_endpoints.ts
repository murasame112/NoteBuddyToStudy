import { Console } from "console";
import { ObjectId } from "bson";
import express from "express";
import e, { Request, Response } from "express";
import { Group } from "../models/group_model";
import { Message } from "../models/message_model";
import * as global from "../global_database_functions";
import { Type } from "../enums/group_type_enum";
import * as globalTools from "../global_tools";
import * as loginService from "../services/login"

const table_name = "groups";

// finds all groups
// /groups
// example:
//  http://localhost:3000/groups
export function getAllGroups(req: Request, res: Response) {
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

// finds group by id
// /group/{id}
// example:
//  http://localhost:3000/group/648c6400e388683aeb23d331
export function getGroupById(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}

  const id = req.params.id;
  const result = global.getItemById(id, table_name);
  let group: Group;
  result.then((value) => {
    group = new Group(value.type, value.users, value.subcategory_id, value.messages, value.created, value._id);
    res.send(group);
  });
}

// finds multiple groups by field and value
// /groups/{field}&{value}
// example:
//  http://localhost:3000/groups/published&true
export function getGroupsByQuery(req: Request, res: Response) {
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

	if(field == 'created'){
		if(typeof value == 'string'){
			value = new Date(value);
		}
	}

  let query = { [field]: value };
  const result = global.getItemsByField(query, table_name);
  const groupArray: Group[] = [];
  let group: Group;
  result.then((value) => {
    value.forEach((element: Group) => {
      group = new Group(element.type, element.users, element.subcategory_id, element.messages, element.created, element._id);
      groupArray.push(group);
    });
    res.send(groupArray);
  });
}

// finds multiple groups by id_field and value of objectId
// /groupsid/{field}&{value}
// example:
//  http://localhost:3000/groupsid/users&64e9be29c7f3fc97903dfdde
export function getGroupsByQueriedId(req: Request, res: Response) {
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
  const groupArray: Group[] = [];
  let group: Group;
  result.then((value) => {
    value.forEach((element: Group) => {
      group = new Group(element.type, element.users, element.subcategory_id, element.messages, element.created, element._id);
      groupArray.push(group);
    });
    res.send(groupArray);
  });
}

// inserts group to database
// /group
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/group
// example body:
//   {
// "type":"two",
// "users":[
//    "64a49ff9a1caf26fbfaa2dbb"
// ]
// }
export function insertGroup(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}

  let users: ObjectId[] = [];
	const subcategory_id = new ObjectId(req.body.subcategory_id);

	if(!Array.isArray(req.body.users) || req.body.users.length == 0){
		res.status(400).send("Error");
		return false;
	}

  req.body.users.forEach((element: string) => {
    let user_id = new ObjectId(element);
    users.push(user_id);
  });
  const group: Group = new Group(req.body.type, users, subcategory_id);
  const result = global.insertItem(group, table_name);
  result.then((value) => {
    if(value.acknowledged){
			res.status(201).send(value.insertedId);
		}else{
			globalTools.logToDatabase("function insertGroup failed", "error");
			res.status(400).send("Error");
		}
  });
}

// inserts multiple groups to database
// /groups
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/groups
// example body:
// [
//     {
// "type":"two",
// "users":[
//    "64a49ff9a1caf26fbfaa2dbb"
// ]
//     },
// {
// "type":"two",
// "users":[
//    "64a49ff9a1caf26fbfaa2dbb"
// ]
// }
//  ]
export function insertMultipleGroups(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const groups = req.body;
  let counter = 0;

  groups.forEach((element: any) => {

    // TODO: przemyśleć, czy tu powinno byc any?
    let usersIds: ObjectId[] = [];
		if(!Array.isArray(element.users) || element.users.length == 0){
			res.status(400).send("Error");
			return false;
		}
    element.users.forEach((elem: string) => {
      let user_id = new ObjectId(elem);
      usersIds.push(user_id);
    });
		let subcategory_id = new ObjectId(req.body.subcategory_id);
    const group: Group = new Group(element.type, usersIds, subcategory_id);

    const result = global.insertItem(group, table_name);
    result.then((value) => {
      counter++;
      if(counter == groups.length && value.acknowledged != false) {
        res.status(201).send();
      }else{
				globalTools.logToDatabase("function insertMultipleGroups failed", "error");
				res.status(400).send("Error");
			}
    });
  });
}

// deletes group by id
// /group/{id}
// example:
//  http://localhost:3000/group/6490d3e5982efd2fe9136154
export function deleteGroup(req: Request, res: Response) {
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
			globalTools.logToDatabase("function deleteGroup failed", "error");
			res.status(400).send("Error");
		}
  });
}

// deletes multiple groups by array of ids
// /groups
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/groups
// example body:
//  ["6490d9efdfd298aad1e8f134",
//  "6490d9f9dfd298aad1e8f135",
//  "6490d9fddfd298aad1e8f136"]

export function deleteMultipleGroups(req: Request, res: Response) {
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
				globalTools.logToDatabase("function deleteMultipleGroups failed", "error");
				res.status(400).send("Error");
			}
    });
  });
}

// deletes multiple groups by field and value
// /groups/{field}&{value}
// example:
//  http://localhost:3000/groups/published&true
export function deleteGroupsByQuery(req: Request, res: Response) {
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
			globalTools.logToDatabase("function deleteGroupsByQuery failed", "error");
			res.status(400).send("Error");
		}
  });
}

// deletes multiple groups by id_field and value of objectId
// /groupsid/{field}&{value}
// example:
//  http://localhost:3000/groupsid/users&64a49ff9a1caf26fbfaa2dbb
export function deleteGroupsByQueriedId(req: Request, res: Response) {
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
			globalTools.logToDatabase("function deleteGroupsByQueriedId failed", "error");
			res.status(400).send("Error");
		}
  });
}

// updates group by id with values passed in request body
// /group/{id}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/group/6490d3e5982efd2fe9136154
// example body:
//   {
// "type":"two",
// "users":[
//       "64a49ff9a1caf26fbfaa2dbb"
// ]
// }
export function updateGroup(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}

  const id = req.params.id;
  let query = req.body;
	if (typeof query._id !== "undefined") {
    query._id = new ObjectId(query._id);
  }
	if (typeof query.subcategory_id !== "undefined") {
    query.subcategory_id = new ObjectId(query.subcategory_id);
  }
	if (typeof query.created !== "undefined") {
    query.created = globalTools.createDateFromString(query.created);
  }

	let user_id: ObjectId;

	
  if (typeof query.users !== "undefined") {
    let usersIds: ObjectId[] = [];

    query.users.forEach((elem: string) => {
      user_id = new ObjectId(elem);
      usersIds.push(user_id);
    });

    query.users = usersIds;
  }
  const result = global.updateItemById(id, table_name, query);
  result.then((value) => {
		if(value.acknowledged){
			res.status(204).send();
		}else{
			globalTools.logToDatabase("function updateGroup failed", "error");
			res.status(400).send("Error");
		}
  });
}

// updates multiple groups by array of ids
// /groups
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/groups
// example body:
// {
//     "ids":
//      ["6490d9efdfd298aad1e8f134",
//      "6490d9f9dfd298aad1e8f135",
//      "6490d9fddfd298aad1e8f136"]
//     ,
//     "query":{
// "type":"two",
// "users":[
//       "64a49ff9a1caf26fbfaa2dbb"
// ]
//     }
//  }
export function updateMultipleGroups(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}

  const ids = req.body.ids;
  let updateQuery = req.body.query;

	if (typeof updateQuery._id !== "undefined") {
    updateQuery._id = new ObjectId(updateQuery._id);
  }
	if (typeof updateQuery.subcategory_id !== "undefined") {
    updateQuery.subcategory_id = new ObjectId(updateQuery.subcategory_id);
  }
	if (typeof updateQuery.created !== "undefined") {
    updateQuery.created = globalTools.createDateFromString(updateQuery.created);
  }

	let user_id: ObjectId;

	
  if (typeof updateQuery.users !== "undefined") {
    let usersIds: ObjectId[] = [];

    updateQuery.users.forEach((elem: string) => {
      user_id = new ObjectId(elem);
      usersIds.push(user_id);
    });

    updateQuery.users = usersIds;
  }
  let counter = 0;
  ids.forEach((element: string) => {
    const result = global.updateItemById(element, table_name, updateQuery);
    result.then((value) => {
      counter++;
      if(counter == ids.length && value.acknowledged != false) {
        res.status(204).send();
      }else{
				globalTools.logToDatabase("function updateMultipleGroups failed", "error");
				res.status(400).send("Error");
			}
    });
  });
}

// updates multiple groups by field and value
// /groups/{field}&{value}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/groups/published&true
// example body:
//   {
// "type":"two",
// "users":[
//    "64a49ff9a1caf26fbfaa2dbb"
// ]
// }
export function updateGroupsByQuery(req: Request, res: Response) {
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

	if(field == 'created'){
		if(typeof value == 'string'){
			value = new Date(value);
		}
	}
	
  let updateQuery = req.body;
	if (typeof updateQuery._id !== "undefined") {
    updateQuery._id = new ObjectId(updateQuery._id);
  }
	if (typeof updateQuery.subcategory_id !== "undefined") {
    updateQuery.subcategory_id = new ObjectId(updateQuery.subcategory_id);
  }
	if (typeof updateQuery.created !== "undefined") {
    updateQuery.created = globalTools.createDateFromString(updateQuery.created);
  }
	
	let user_id: ObjectId;
  if (typeof updateQuery.users !== "undefined") {
    let usersIds: ObjectId[] = [];

    updateQuery.users.forEach((elem: string) => {
      user_id = new ObjectId(elem);
      usersIds.push(user_id);
    });

    updateQuery.users = usersIds;
  }
  let query = { [field]: JSON.parse(value) };
  const result = global.updateItemsByField(query, table_name, updateQuery);
  result.then((value) => {
		if(value.acknowledged){
			res.status(204).send();
		}else{
			globalTools.logToDatabase("function updateGroupsByQuery failed", "error");
			res.status(400).send("Error");
		}
  });
}

// updates multiple groups by id_field and value of objectId
// /groupsid/{field}&{value}
// example:
//  http://localhost:3000/groupsid/users&64a49ff9a1caf26fbfaa2dbb
//   {
// "type":"two",
// "users":[
//    "64a49ff9a1caf26fbfaa2dbb"
// ]
// }
export function updateGroupsByQueriedId(req: Request, res: Response) {
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
	if (typeof updateQuery._id !== "undefined") {
    updateQuery._id = new ObjectId(updateQuery._id);
  }
	if (typeof updateQuery.subcategory_id !== "undefined") {
    updateQuery.subcategory_id = new ObjectId(updateQuery.subcategory_id);
  }
	if (typeof updateQuery.created !== "undefined") {
    updateQuery.created = globalTools.createDateFromString(updateQuery.created);
  }

	let user_id: ObjectId;
	if (typeof updateQuery.users !== "undefined") {
    let usersIds: ObjectId[] = [];

    updateQuery.users.forEach((elem: string) => {
      user_id = new ObjectId(elem);
      usersIds.push(user_id);
    });

    updateQuery.users = usersIds;
  }

	
  let query = { [field]: objValue };

  const result = global.updateItemsByField(query, table_name, updateQuery);
  result.then((value) => {
		if(value.acknowledged){
			res.status(204).send();
		}else{
			globalTools.logToDatabase("function updateGroupsByQueriedId failed", "error");
			res.status(400).send("Error");
		}
  });
}

// replaces group by id with new group passed in request body
// /group/{id}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/group/6490d3e5982efd2fe9136154
// example body:
//   {
// "type":"two",
// "users":[
//    "64a49ff9a1caf26fbfaa2dbb"
// ]
// }
export function replaceGroup(req: Request, res: Response) {
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

	if (typeof query.created !== "undefined") {
    query.created = globalTools.createDateFromString(query.created);
  }else{
		query.created = new Date();
	}


	if(!Array.isArray(query.users) || query.users.length == 0){
		res.status(400).send("Error");
		return false;
	}

  let group: Group;
  group = new Group(query.type, query.users, query.subcategory_id, query.messages, query.created, query._id);
  const result = global.replaceItemById(id, table_name, group);
  result.then((value) => {
		if(value.acknowledged){
			res.status(201).send();
		}else{
			globalTools.logToDatabase("function replaceGroup failed", "error");
			res.status(400).send("Error");
		}
  });
}

// steals (returns a group, but then deletes it from database) group by id
// /stealgroup/{id}
// example:
//  http://localhost:3000/stealgroup/6490d3e5982efd2fe9136154
export function stealGroup(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const id = req.params.id;
  const result = global.stealItemById(id, table_name);
  result.then((value) => {
    let group: Group;
    group = new Group(value.value.type, value.value.users, value.value.subcategory_id, value.value.message, value.value.created,	value.value._id);
    res.status(201).send(group);
  });
}

// adds user to fitting group or creates one
// /addtogroup
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/addtogroup
// example body:
//   {
// "type":"two",
// "user_id":"some id",
// "subcategory_id":"some id"
// }
export function addUserToGroup(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}

	const user_id = new ObjectId(req.body.user_id);
	const subcategory_id = new ObjectId(req.body.subcategory_id);
	const type = req.body.type;
	let group: Group;
	let size: number;

	if(type == "two"){
		size = 1;
	}else{
		size = 4;
	}
	
  let query = { ["subcategory_id"]: subcategory_id, ["type"]:type, ["users."+size+""]:{'$exists':false} };

  const getResult = global.getItemsByField(query, table_name);
	getResult.then((value) => {
		let addResult: Promise<any>;
		let group_id;
		if(value.length == 0){
			group = new Group(type, [user_id], subcategory_id);
			addResult = global.insertItem(group, table_name);
		}else if(value[0].users.some( (element) => element.toString() === user_id.toString() )){
			res.status(400).send("Error");
			return false;
		}
		else{
			let element = value[0];
			element.users.push(user_id);
			group = new Group(element.type, element.users, element.subcategory_id, element.messages, element.created, element._id);
			addResult = global.replaceItemById(value[0]._id, table_name, group);
		}
		
    addResult.then((val) => {
			if(val.acknowledged){
				if(val.insertedId){
					group_id = val.insertedId;
				}else{
					group_id = value[0]._id;
				}
				res.status(201).send(group_id);
			}else{
				globalTools.logToDatabase("function addUserToGroup failed", "error");
				res.status(400).send("Error");
			}
		});
  });
}

// updates group by id with values passed in request body
// /addmessagetogroup/{id}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/addmessagetogroup/6490d3e5982efd2fe9136154
// example body:
//   {
	// "message": {
  //    "login":"abc",
  //    "content":"one",
  //    "date":"2024-01-12T17:06:55.332+00:00"
  //   }
// }
export function addMessageToGroup(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}

  const id = req.params.id;
  let query = req.body;

	const getResult = global.getItemById(id, table_name);
	getResult.then((val) => {

    let messages: Message[] = val.messages;		
		
    messages.push(query.message);  
		let message = {['messages']:messages};
		const result = global.updateItemById(id, table_name, message);
		result.then((value) => {
			if(value.acknowledged){
				res.status(204).send();
			}else{
				globalTools.logToDatabase("function addMessageToGroup failed", "error");
				res.status(400).send("Error");
			}
		});

	});
  
}