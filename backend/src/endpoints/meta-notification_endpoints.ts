import { Console } from "console";
import { ObjectId } from "bson";
import express from "express";
import e, { Request, Response } from "express";
import { MetaNotification } from "../models/meta-notification_model";
import * as global from "../global_database_functions";
import * as globalTools from "../global_tools";

const table_name = "meta-notifications";

// finds all metanotifcations
// /metanotifcations
// example:
//  http://localhost:3000/metanotifcations
export function getAllMetaNotifications(req: Request, res: Response) {
  const result = global.getAllItems(table_name);
  result.then((value) => {
    res.send(value);
  });
}

// finds metanotifcation by id
// /metanotifcation/{id}
// example:
//  http://localhost:3000/metanotifcation/648c6400e388683aeb23d331
export function getMetaNotificationById(req: Request, res: Response) {
  const id = req.params.id;
  const result = global.getItemById(id, table_name);
  let metanotifcation: MetaNotification;
  result.then((value) => {
    metanotifcation = new MetaNotification(
			value.notification_id,
			value.user_id,
			value.value,
			value.active,
			value.shared_date
    );
    res.send(metanotifcation);
  });
}

// finds multiple metanotifcations by field and value
// /metanotifcations/{field}&{value}
// example:
//  http://localhost:3000/metanotifcations/published&true
export function getMetaNotificationsByQuery(req: Request, res: Response) {
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
  const metanotifcationArray: MetaNotification[] = [];
  let metanotifcation: MetaNotification;
  result.then((value) => {
    value.forEach((element: MetaNotification) => {
      metanotifcation = new MetaNotification(
				element.notification_id,
				element.user_id,
				element.value,
				element.active,
				element.shared_date
      );
      metanotifcationArray.push(metanotifcation);
    });
    res.send(metanotifcationArray);
  });
}

// finds multiple metanotifcations by id_field and value of objectId
// /metanotifcationsid/{field}&{value}
// example:
//  http://localhost:3000/metanotifcationsid/category_id&6490d9efdfd298aad1e8f134
export function getMetaNotificationsByQueriedId(req: Request, res: Response) {
  const field = req.params.field;
  const value = req.params.value;
  const objValue = new ObjectId(value);

  let query = { [field]: objValue };
  const result = global.getItemsByField(query, table_name);
  const metanotifcationArray: MetaNotification[] = [];
  let metanotifcation: MetaNotification;
  result.then((value) => {
    value.forEach((element: MetaNotification) => {
      metanotifcation = new MetaNotification(
				element.notification_id,
				element.user_id,
				element.value,
				element.active,
				element.shared_date
      );
      metanotifcationArray.push(metanotifcation);
    });
    res.send(metanotifcationArray);
  });
}

// inserts metanotifcation to database
// /metanotifcation
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/metanotifcation
// example body:
//   {
	// "notifiaction_id":"64a4a2aaa1caf26fbfaa2dc8",
	// "user_id":"64a49ff9a1caf26fbfaa2dbb",
	// "value":"newUser"
// }
export function insertMetaNotification(req: Request, res: Response) {
  const notification_id = new ObjectId(req.body.notification_id);
  const user_id = new ObjectId(req.body.user_id);

  const metanotifcation: MetaNotification = new MetaNotification(
		notification_id,
		user_id,
		req.body.value,
		req.body.active
  );
  const result = global.insertItem(metanotifcation, table_name);
  result.then((value) => {
    value.acknowledged
      ? res.status(201).send(value.insertedId)
      : res.status(400).send("Error");
  });
}

// inserts multiple metanotifcations to database
// /metanotifcations
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/metanotifcations
// example body:
// [
//     {
	// "notifiaction_id":"64a4a2aaa1caf26fbfaa2dc8",
	// "user_id":"64a49ff9a1caf26fbfaa2dbb",
	// "value":"newUser"
//     },
// {
	// "notifiaction_id":"64a4a2aaa1caf26fbfaa2dc8",
	// "user_id":"64a49ff9a1caf26fbfaa2dbb",
	// "value":"newUser2"
// }
//  ]
export function insertMultipleMetaNotifications(req: Request, res: Response) {
  const metanotifcations = req.body;
  let counter = 0;
  let notification_id = new ObjectId();
  let user_id = new ObjectId();
  metanotifcations.forEach((element: MetaNotification) => {
    notification_id = new ObjectId(element.notification_id);
    user_id = new ObjectId(element.user_id);
    const metanotifcation: MetaNotification = new MetaNotification(
			notification_id,
			user_id,
			req.body.value,
			req.body.active
    );

    const result = global.insertItem(metanotifcation, table_name);
    result.then((value) => {
      counter++;
      if(counter == metanotifcations.length && value.acknowledged != false) {
        res.status(204).send();
      }else{
				res.status(400).send("Error");
			}
    });
  });
}

// deletes metanotifcation by id
// /metanotifcation/{id}
// example:
//  http://localhost:3000/metanotifcation/6490d3e5982efd2fe9136154
export function deleteMetaNotification(req: Request, res: Response) {
  const id = req.params.id;
  const result = global.deleteItemById(id, table_name);
  result.then((value) => {
    value.acknowledged ? res.status(204).send() : res.status(400).send("Error");
  });
}

// deletes multiple metanotifcations by array of ids
// /metanotifcations
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/metanotifcations
// example body:
//  ["6490d9efdfd298aad1e8f134",
//  "6490d9f9dfd298aad1e8f135",
//  "6490d9fddfd298aad1e8f136"]

export function deleteMultipleMetaNotifications(req: Request, res: Response) {
  const ids = req.body;
  let counter = 0;
  ids.forEach((element: string) => {
    const result = global.deleteItemById(element, table_name);
    result.then((value) => {
      counter++;
      if(counter == ids.length && value.acknowledged != false) {
        res.status(204).send();
      }else{
				res.status(400).send("Error");
			}
    });
  });
}

// deletes multiple metanotifcations by field and value
// /metanotifcations/{field}&{value}
// example:
//  http://localhost:3000/metanotifcations/published&true
export function deleteMetaNotificationsByQuery(req: Request, res: Response) {
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

// deletes multiple meta-notifications by id_field and value of objectId
// /metanotificationsid/{field}&{value}
// example:
//  http://localhost:3000/metanotificationsid/user_id&6490d9efdfd298aad1e8f134
export function deleteMetaNotificationsByQueriedId(req: Request, res: Response) {
  const field = req.params.field;
  const value = req.params.value;
  const objValue = new ObjectId(value);

  let query = { [field]: objValue };
  const result = global.deleteItemsByField(query, table_name);
  result.then((value) => {
    value.acknowledged ? res.status(201).send() : res.status(400).send("Error");
  });
}


export function updateMetaNotification(req: Request, res: Response) {
  const id = req.params.id;
  let query = req.body;
  if (typeof query.notification_id !== "undefined") {
    query.notification_id = new ObjectId(query.notification_id);
  }
  if (typeof query.user_id !== "undefined") {
    query.user_id = new ObjectId(query.user_id);
  }
	query.shared_date = globalTools.createDateFromString(query.shared_date);

  const result = global.updateItemById(id, table_name, query);
  result.then((value) => {
    value.acknowledged ? res.status(204).send() : res.status(400).send("Error");
  });
}

// updates multiple metanotifcations by array of ids
// /metanotifcations
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/metanotifcations
// example body:
// {
//     "ids":
//      ["6490d9efdfd298aad1e8f134",
//      "6490d9f9dfd298aad1e8f135",
//      "6490d9fddfd298aad1e8f136"]
//     ,
//     "query":{
	// "value":"newUser"
//     }
//  }
export function updateMultipleMetaNotifications(req: Request, res: Response) {
  const ids = req.body.ids;
  let updateQuery = req.body.query;
  if (typeof updateQuery.notification_id !== "undefined") {
    updateQuery.notification_id = new ObjectId(updateQuery.notification_id);
  }
  if (typeof updateQuery.user_id !== "undefined") {
    updateQuery.user_id = new ObjectId(updateQuery.user_id);
  }
	updateQuery.shared_date = globalTools.createDateFromString(updateQuery.shared_date);

  let counter = 0;
  ids.forEach((element: string) => {
    const result = global.updateItemById(element, table_name, updateQuery);
    result.then((value) => {
      counter++;
      if(counter == ids.length && value.acknowledged != false) {
        res.status(204).send();
      }else{
				res.status(400).send("Error");
			}
    });
  });
}

// updates multiple metanotifcations by field and value
// /metanotifcations/{field}&{value}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/metanotifcations/published&true
// example body:
//   {
	// "value":"newUser"
// }
export function updateMetaNotificationsByQuery(req: Request, res: Response) {
  const field = req.params.field;
  let value = req.params.value;
  try {
    value = JSON.parse(value);
  } catch (e: any) {
    value = '"' + value + '"';
    value = JSON.parse(value);
  }
  let updateQuery = req.body;
  if (typeof updateQuery.notification_id !== "undefined") {
    updateQuery.notification_id = new ObjectId(updateQuery.notification_id);
  }
  if (typeof updateQuery.user_id !== "undefined") {
    updateQuery.user_id = new ObjectId(updateQuery.user_id);
  }
	updateQuery.shared_date = globalTools.createDateFromString(updateQuery.shared_date);

  let query = { [field]: value };
  const result = global.updateItemsByField(query, table_name, updateQuery);
  result.then((value) => {
    value.acknowledged ? res.status(204).send() : res.status(400).send("Error");
  });
}

// updates multiple metanotifications by id_field and value of objectId
// /metanotificationsid/{field}&{value}
// example:
//  http://localhost:3000/metanotificationsid/user_id&6490d9efdfd298aad1e8f134
export function updateMetaNotificationsByQueriedId(req: Request, res: Response) {
  const field = req.params.field;
  let value = req.params.value;
  const objValue = new ObjectId(value);

  let updateQuery = req.body;
  if (typeof updateQuery.notifiaction_id !== "undefined") {
    updateQuery.notifiaction_id = new ObjectId(updateQuery.notifiaction_id);
  }
  if (typeof updateQuery.user_id !== "undefined") {
    updateQuery.user_id = new ObjectId(updateQuery.user_id);
  }
	updateQuery.shared_date = globalTools.createDateFromString(updateQuery.shared_date);
  let query = { [field]: objValue };

  const result = global.updateItemsByField(query, table_name, updateQuery);
  result.then((value) => {
    value.acknowledged ? res.status(204).send() : res.status(400).send("Error");
  });
}

// replaces metanotifcation by id with new metanotifcation passed in request body
// /metanotifcation/{id}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/metanotifcation/6490d3e5982efd2fe9136154
// example body:
//   {
	// "value":"newUser"
// }
export function replaceMetaNotification(req: Request, res: Response) {
  const id = req.params.id;
  const query = req.body;
  let metanotifcation: MetaNotification;
  metanotifcation = new MetaNotification(
		query.notification_id,
		query.user_id,
		query.value,
		query.active,
		query.shared_date
  );
  const result = global.replaceItemById(id, table_name, metanotifcation);
  result.then((value) => {
    value.acknowledged ? res.status(201).send() : res.status(400).send("Error");
  });
}

// steals (returns a metanotifcation, but then deletes it from database) metanotifcation by id
// /stealmetanotifcation/{id}
// example:
//  http://localhost:3000/stealmetanotifcation/6490d3e5982efd2fe9136154
export function stealMetaNotification(req: Request, res: Response) {
  const id = req.params.id;
  const result = global.stealItemById(id, table_name);
  result.then((value) => {
    let metanotifcation: MetaNotification;
    metanotifcation = new MetaNotification(
			value.value.notification_id,
		value.value.user_id,
		value.value.value,
		value.value.active,
		value.value.shared_date
    );
    res.status(201).send(metanotifcation);
  });
}
