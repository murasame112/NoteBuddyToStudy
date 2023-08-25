import { Console } from "console";
import { ObjectId } from "bson";
import express from "express";
import e, { Request, Response } from "express";
import { Hint } from "../models/hint_model";
import * as global from "../global_functions";

const table_name = "hints";

// finds all hints
// /hints
// example:
//  http://localhost:3000/hints
export function getAllHints(req: Request, res: Response) {
  const result = global.getAllItems(table_name);
  result.then((value) => {
    res.send(value);
  });
}

// finds hint by id
// /hint/{id}
// example:
//  http://localhost:3000/hint/648c6400e388683aeb23d331
export function getHintById(req: Request, res: Response) {
  const id = req.params.id;
  const result = global.getItemById(id, table_name);
  let hint: Hint;
  result.then((value) => {
    hint = new Hint(value.content);
    res.send(hint);
  });
}

// finds multiple hints by field and value
// /hints/{field}&{value}
// example:
//  http://localhost:3000/hints/published&true
export function getHintsByQuery(req: Request, res: Response) {
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
  const hintArray: Hint[] = [];
  let hint: Hint;
  result.then((value) => {
    value.forEach((element: Hint) => {
      hint = new Hint(element.content);
      hintArray.push(hint);
    });
    res.send(hintArray);
  });
}

// finds multiple hints by id_field and value of objectId
// /hintsid/{field}&{value}
// example:
//  http://localhost:3000/hintsid/category_id&6490d9efdfd298aad1e8f134
export function getHintsByQueriedId(req: Request, res: Response) {
  const field = req.params.field;
  const value = req.params.value;
  const objValue = new ObjectId(value);

  let query = { [field]: objValue };
  const result = global.getItemsByField(query, table_name);
  const hintArray: Hint[] = [];
  let hint: Hint;
  result.then((value) => {
    value.forEach((element: Hint) => {
      hint = new Hint(element.content);
      hintArray.push(hint);
    });
    res.send(hintArray);
  });
}

// inserts hint to database
// /hint
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/hint
// example body:
//   {
//      "content":"Wyłącz wszystkie urządzenia, które przeszkadzają ci podczas nauki."
// }
export function insertHint(req: Request, res: Response) {
  const hint: Hint = new Hint(req.body.content);
  const result = global.insertItem(hint, table_name);
  result.then((value) => {
    value.acknowledged
      ? res.status(201).send("id: " + value.insertedId)
      : res.status(400).send("Error");
  });
}

// inserts multiple hints to database
// /hints
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/hints
// example body:
// [
//     {
//      "content":"asdf fdsa asdf fdsa"
//     },
// {
//      "content":"Wyłącz wszystkie urządzenia, które przeszkadzają ci podczas nauki."
// }
//  ]
export function insertMultipleHints(req: Request, res: Response) {
  const hints = req.body;
  let counter = 0;
  hints.forEach((element: Hint) => {
    const hint: Hint = new Hint(element.content);

    const result = global.insertItem(hint, table_name);
    result.then((value) => {
      counter++;
      if (value.acknowledged == false) {
        res.status(400).send("Error");
      }
      if (counter == hints.length) {
        res.status(204).send();
      }
    });
  });
}

// deletes hint by id
// /hint/{id}
// example:
//  http://localhost:3000/hint/6490d3e5982efd2fe9136154
export function deleteHint(req: Request, res: Response) {
  const id = req.params.id;
  const result = global.deleteItemById(id, table_name);
  result.then((value) => {
    value.acknowledged ? res.status(204).send() : res.status(400).send("Error");
  });
}

// deletes multiple hints by array of ids
// /hints
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/hints
// example body:
//  ["6490d9efdfd298aad1e8f134",
//  "6490d9f9dfd298aad1e8f135",
//  "6490d9fddfd298aad1e8f136"]

export function deleteMultipleHints(req: Request, res: Response) {
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

// deletes multiple hints by field and value
// /hints/{field}&{value}
// example:
//  http://localhost:3000/hints/published&true
export function deleteHintsByQuery(req: Request, res: Response) {
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

// updates hint by id with values passed in request body
// /hint/{id}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/hint/6490d3e5982efd2fe9136154
// example body:
//   {
//      "content":"Wyłącz wszystkie urządzenia, które przeszkadzają ci podczas nauki."
// }
export function updateHint(req: Request, res: Response) {
  const id = req.params.id;
  const query = req.body;
  const result = global.updateItemById(id, table_name, query);
  result.then((value) => {
    value.acknowledged ? res.status(204).send() : res.status(400).send("Error");
  });
}

// updates multiple hints by array of ids
// /hints
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/hints
// example body:
// {
//     "ids":
//      ["6490d9efdfd298aad1e8f134",
//      "6490d9f9dfd298aad1e8f135",
//      "6490d9fddfd298aad1e8f136"]
//     ,
//     "query":{
//          "content":"Wyłącz wszystkie urządzenia, które przeszkadzają ci podczas nauki."
//     }
//  }
export function updateMultipleHints(req: Request, res: Response) {
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

// updates multiple hints by field and value
// /hints/{field}&{value}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/hints/published&true
// example body:
//   {
//      "content":"Wyłącz wszystkie urządzenia, które przeszkadzają ci podczas nauki."
// }
export function updateHintsByQuery(req: Request, res: Response) {
  const field = req.params.field;
  const value = req.params.value;
  const updateQuery = req.body;
  let query = { [field]: JSON.parse(value) };
  const result = global.updateItemsByField(query, table_name, updateQuery);
  result.then((value) => {
    value.acknowledged ? res.status(204).send() : res.status(400).send("Error");
  });
}

// replaces hint by id with new hint passed in request body
// /hint/{id}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/hint/6490d3e5982efd2fe9136154
// example body:
//   {
//      "content":"Wyłącz wszystkie urządzenia, które przeszkadzają ci podczas nauki."
// }
export function replaceHint(req: Request, res: Response) {
  const id = req.params.id;
  const query = req.body;
  let hint: Hint;
  hint = new Hint(query.content);
  const result = global.replaceItemById(id, table_name, hint);
  result.then((value) => {
    value.acknowledged ? res.status(201).send() : res.status(400).send("Error");
  });
}

// steals (returns a hint, but then deletes it from database) hint by id
// /stealhint/{id}
// example:
//  http://localhost:3000/stealhint/6490d3e5982efd2fe9136154
export function stealHint(req: Request, res: Response) {
  const id = req.params.id;
  const result = global.stealItemById(id, table_name);
  result.then((value) => {
    let hint: Hint;
    hint = new Hint(value.value.content);
    res.status(201).send(hint);
  });
}
