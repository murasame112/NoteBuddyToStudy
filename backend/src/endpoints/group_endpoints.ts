import { Console } from "console";
import { ObjectId } from "bson";
import express from "express";
import e, { Request, Response } from "express";
import { Group } from "../models/group_model";
import * as global from "../global_functions";
import { Type } from "../enums/group_type_enum";

const table_name = "groups";

// finds all groups
// /groups
// example:
//  http://localhost:3000/groups
export function getAllGroups(req: Request, res: Response) {
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
  const id = req.params.id;
  const result = global.getItemById(id, table_name);
  let group: Group;
  result.then((value) => {
    group = new Group(value.type, value.users);
    res.send(group);
  });
}

// finds multiple groups by field and value
// /groups/{field}&{value}
// example:
//  http://localhost:3000/groups/published&true
export function getGroupsByQuery(req: Request, res: Response) {
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
  const groupArray: Group[] = [];
  let group: Group;
  result.then((value) => {
    value.forEach((element: Group) => {
      group = new Group(element.type, element.users);
      groupArray.push(group);
    });
    res.send(groupArray);
  });
}

// finds multiple groups by id_field and value of objectId
// /groupsid/{field}&{value}
// example:
//  http://localhost:3000/groupsid/category_id&6490d9efdfd298aad1e8f134
export function getGroupsByQueriedId(req: Request, res: Response) {
  const field = req.params.field;
  const value = req.params.value;
  const objValue = new ObjectId(value);

  let query = { [field]: objValue };
  const result = global.getItemsByField(query, table_name);
  const groupArray: Group[] = [];
  let group: Group;
  result.then((value) => {
    value.forEach((element: Group) => {
      group = new Group(element.type, element.users);
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
  let users: ObjectId[] = [];
  req.body.users.forEach((element: string) => {
    let user_id = new ObjectId(element);
    users.push(user_id);
  });
  const group: Group = new Group(req.body.type, users);
  const result = global.insertItem(group, table_name);
  result.then((value) => {
    value.acknowledged
      ? res.status(201).send("id: " + value.insertedId)
      : res.status(400).send("Error");
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
  const groups = req.body;
  let counter = 0;
  groups.forEach((element: any) => {
    // TODO: przemyśleć, czy tu powinno byc any?
    let usersIds: ObjectId[] = [];
    element.users.forEach((elem: string) => {
      let user_id = new ObjectId(elem);
      usersIds.push(user_id);
    });
    const group: Group = new Group(element.type, usersIds);

    const result = global.insertItem(group, table_name);
    result.then((value) => {
      counter++;
      if (value.acknowledged == false) {
        res.status(400).send("Error");
      }
      if (counter == groups.length) {
        res.status(204).send();
      }
    });
  });
}

// deletes group by id
// /group/{id}
// example:
//  http://localhost:3000/group/6490d3e5982efd2fe9136154
export function deleteGroup(req: Request, res: Response) {
  const id = req.params.id;
  const result = global.deleteItemById(id, table_name);
  result.then((value) => {
    value.acknowledged ? res.status(204).send() : res.status(400).send("Error");
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
  const ids = req.body;
  let counter = 0;
  ids.forEach((element: string) => {
    const result = global.deleteItemById(element, table_name);
    result.then((value) => {
      counter++;
      if (value.acknowledged == false) {
        res.status(400).send("Error");
      }
      if (counter == ids.length) {
        res.status(204).send();
      }
    });
  });
}

// deletes multiple groups by field and value
// /groups/{field}&{value}
// example:
//  http://localhost:3000/groups/published&true
export function deleteGroupsByQuery(req: Request, res: Response) {
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
    value.acknowledged ? res.status(201).send() : res.status(400).send("Error");
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
  const id = req.params.id;
  let query = req.body;
  if (typeof query.users !== "undefined") {
    let usersIds: ObjectId[] = [];

    query.users.forEach((elem: string) => {
      let user_id = new ObjectId(elem);
      usersIds.push(user_id);
    });

    query.users = usersIds;
  }
  const result = global.updateItemById(id, table_name, query);
  result.then((value) => {
    value.acknowledged ? res.status(204).send() : res.status(400).send("Error");
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
  const ids = req.body.ids;
  let updateQuery = req.body.query;
  if (typeof updateQuery.users !== "undefined") {
    let usersIds: ObjectId[] = [];

    updateQuery.users.forEach((elem: string) => {
      let user_id = new ObjectId(elem);
      usersIds.push(user_id);
    });

    updateQuery.users = usersIds;
  }
  let counter = 0;
  ids.forEach((element: string) => {
    const result = global.updateItemById(element, table_name, updateQuery);
    result.then((value) => {
      counter++;
      if (value.acknowledged == false) {
        res.status(400).send("Error");
      }
      if (counter == ids.length) {
        res.status(204).send();
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
  const field = req.params.field;
  let value = req.params.value;
  try {
    value = JSON.parse(value);
  } catch (e: any) {
    value = '"' + value + '"';
    value = JSON.parse(value);
  }
  let updateQuery = req.body;
  if (typeof updateQuery.users !== "undefined") {
    let usersIds: ObjectId[] = [];

    updateQuery.users.forEach((elem: string) => {
      let user_id = new ObjectId(elem);
      usersIds.push(user_id);
    });

    updateQuery.users = usersIds;
  }
  let query = { [field]: JSON.parse(value) };
  const result = global.updateItemsByField(query, table_name, updateQuery);
  result.then((value) => {
    value.acknowledged ? res.status(204).send() : res.status(400).send("Error");
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
  const id = req.params.id;
  const query = req.body;
  let group: Group;
  group = new Group(query.type, query.users);
  const result = global.replaceItemById(id, table_name, group);
  result.then((value) => {
    value.acknowledged ? res.status(201).send() : res.status(400).send("Error");
  });
}

// steals (returns a group, but then deletes it from database) group by id
// /stealgroup/{id}
// example:
//  http://localhost:3000/stealgroup/6490d3e5982efd2fe9136154
export function stealGroup(req: Request, res: Response) {
  const id = req.params.id;
  const result = global.stealItemById(id, table_name);
  result.then((value) => {
    let group: Group;
    group = new Group(value.value.type, value.value.users);
    res.status(201).send(group);
  });
}
