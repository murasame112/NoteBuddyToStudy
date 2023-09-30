import { Console } from "console";
import { ObjectId } from "bson";
import express from "express";
import e, { Request, Response } from "express";
import { User } from "../models/user_model";
import * as global from "../global_database_functions";
import { Role } from "../enums/role_enum";

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
      value.active,
      value.role,
			value.untrusted,
			value.saved_notes,
			value.followed_users,
			value.blocked_users,
			value.created
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
  let value = req.params.value;
  try {
    value = JSON.parse(value);
  } catch (e: any) {
    value = '"' + value + '"';
    value = JSON.parse(value);
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
        element.active,
        element.role,
				element.untrusted,
				element.saved_notes,
				element.followed_users,
				element.blocked_users,
				element.created
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
        element.active,
        element.role,
				element.untrusted,
				element.saved_notes,
				element.followed_users,
				element.blocked_users,
				element.created
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
    //  "login":"custom login",
    //  "avatar_url":"custom url",
    //  "email":"custom email",
    //  "password":"custom password",
    //  "active":true,
		// 	"role":"user"
// }
export function insertUser(req: Request, res: Response) {
  const user: User = new User(
    req.body.login,
    req.body.avatar_url,
    req.body.email,
    req.body.password,
    req.body.active,
    req.body.role,
		req.body.untrusted,
		req.body.saved_notes,
		req.body.followed_users,
		req.body.blocked_users
  );
  const result = global.insertItem(user, table_name);
  result.then((value) => {
    value.acknowledged
      ? res.status(201).send(value.insertedId)
      : res.status(400).send("Error");
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
    //  "active":true,
		// 	"role":"user"
//     },
// {
    //  "login":"custom login",
    //  "avatar_url":"custom url",
    //  "email":"custom email",
    //  "password":"custom password",
    //  "active":true,
		// 	"role":"user"
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
      element.password,
      element.active,
      element.role,
			element.untrusted,
			element.saved_notes,
			element.followed_users,
			element.blocked_users
    );

    const result = global.insertItem(user, table_name);
    result.then((value) => {
      counter++;
      if (value.acknowledged == false) {
        res.status(400).send("Error");
      }
      if (counter == users.length) {
        res.status(204).send();
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
    value.acknowledged ? res.status(204).send() : res.status(400).send("Error");
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
      if (value.acknowledged == false) {
        res.status(400).send("Error");
      }
      if (counter == ids.length) {
        res.status(204).send();
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

// updates user by id with values passed in request body
// /user/{id}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/user/6490d3e5982efd2fe9136154
// example body:
//   {
//      "login":"custom login",
//      "description":"custom description"
// }
export function updateUser(req: Request, res: Response) {
  const id = req.params.id;
  const query = req.body;
  const result = global.updateItemById(id, table_name, query);
  result.then((value) => {
    value.acknowledged ? res.status(204).send() : res.status(400).send("Error");
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

// updates multiple users by field and value
// /users/{field}&{value}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/users/published&true
// example body:
//   {
//      "login":"custom login"
// }
export function updateUsersByQuery(req: Request, res: Response) {
  const field = req.params.field;
  const value = req.params.value;
  const updateQuery = req.body;
  let query = { [field]: JSON.parse(value) };
  const result = global.updateItemsByField(query, table_name, updateQuery);
  result.then((value) => {
    value.acknowledged ? res.status(204).send() : res.status(400).send("Error");
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
    //  "active":true,
		// 	"role":"user"
// }
export function replaceUser(req: Request, res: Response) {
  const id = req.params.id;
  const query = req.body;
  let user: User;
  user = new User(
    query.login,
    query.avatar_url,
    query.email,
    query.password,
    query.active,
    query.role,
		query.untrusted,
		query.saved_notes,
		query.followed_users,
		query.blocked_users
  );
  const result = global.replaceItemById(id, table_name, user);
  result.then((value) => {
    value.acknowledged ? res.status(201).send() : res.status(400).send("Error");
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
      value.valuet.password,
      value.value.active,
      value.value.role,
			value.value.untrusted,
			value.value.saved_notes,
			value.value.followed_users,
			value.value.blocked_users,
			value.value.created
    );
    res.status(201).send(user);
  });
}
