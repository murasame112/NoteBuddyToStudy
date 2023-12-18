import { Console } from "console";
import express from "express";
import e, { Request, Response } from "express";
import { Notification } from "../models/notification_model";
import * as global from "../global_database_functions";
import * as globalTools from "../global_tools";
import * as loginService from "../services/login"

const table_name = "notifications";

// finds all notifications
// /notifications
// example:
//  http://localhost:3000/notifications
export function getAllNotifications(req: Request, res: Response) {
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

// finds notification by id
// /notification/{id}
// example:
//  http://localhost:3000/notification/648c6400e388683aeb23d331
export function getNotificationById(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const id = req.params.id;
  const result = global.getItemById(id, table_name);
  let notification: Notification;
  result.then((value) => {
    notification = new Notification(value.content);
    res.send(notification);
  });
}

// finds multiple notifications by field and value
// /notifications/{field}&{value}
// example:
//  http://localhost:3000/notifications/published&true
export function getNotificationsByQuery(req: Request, res: Response) {
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
  const notificationArray: Notification[] = [];
  let notification: Notification;
  result.then((value) => {
    value.forEach((element: Notification) => {
      notification = new Notification(element.content);
      notificationArray.push(notification);
    });
    res.send(notificationArray);
  });
}

// inserts notification to database
// /notification
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/notification
// example body:
//   {
//      "content":"custom content"
// }
export function insertNotification(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const notification: Notification = new Notification(
    req.body.content
  );
  const result = global.insertItem(notification, table_name);
  result.then((value) => {
    if(value.acknowledged){
			res.status(201).send(value.insertedId);
		}else{
			globalTools.logToDatabase("function insertNotification failed", "error");
			res.status(400).send("Error");
		}
  });
}

// inserts multiple notifications to database
// /notifications
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/notifications
// example body:
// [
// {
//    "content":"custom content"
// }
//  ]
export function insertMultipleNotifications(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const notifications = req.body;
  let counter = 0;
  notifications.forEach((element: Notification) => {
    const notification: Notification = new Notification(
      element.content
    );

    const result = global.insertItem(notification, table_name);
    result.then((value) => {
      counter++;
      if(counter == notifications.length && value.acknowledged != false) {
        res.status(201).send();
      }else{
				globalTools.logToDatabase("function insertMultipleNotifications failed", "error");
				res.status(400).send("Error");
			}
    });
  });
}

// deletes notification by id
// /notification/{id}
// example:
//  http://localhost:3000/notification/6490d3e5982efd2fe9136154
export function deleteNotification(req: Request, res: Response) {
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
			globalTools.logToDatabase("function deleteNotification failed", "error");
			res.status(400).send("Error");
		}
  });
}

// deletes multiple notifications by array of ids
// /notifications
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/notifications
// example body:
//  ["6490d9efdfd298aad1e8f134",
//  "6490d9f9dfd298aad1e8f135",
//  "6490d9fddfd298aad1e8f136"]

export function deleteMultipleNotifications(req: Request, res: Response) {
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
				globalTools.logToDatabase("function deleteMultipleNotifications failed", "error");
				res.status(400).send("Error");
			}
    });
  });
}

// deletes multiple notifications by field and value
// /notifications/{field}&{value}
// example:
//  http://localhost:3000/notifications/published&true
export function deleteNotificationsByQuery(req: Request, res: Response) {
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
			globalTools.logToDatabase("function deleteNotificationsByQuery failed", "error");
			res.status(400).send("Error");
		} 
  });
}

// updates notification by id with values passed in request body
// /notification/{id}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/notification/6490d3e5982efd2fe9136154
// example body:
//   {
//      "content":"custom content"
// }
export function updateNotification(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const id = req.params.id;
  const query = req.body;
  const result = global.updateItemById(id, table_name, query);
  result.then((value) => {
		if(value.acknowledged){
			res.status(204).send();
		}else{
			globalTools.logToDatabase("function updateNotification failed", "error");
			res.status(400).send("Error");
		} 
  });
}

// updates multiple notifications by array of ids
// /notifications
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/notifications
// example body:
// {
//     "ids":
//      ["6490d9efdfd298aad1e8f134",
//      "6490d9f9dfd298aad1e8f135",
//      "6490d9fddfd298aad1e8f136"]
//     ,
//     "query":{
//        "content":"custom content"
//     }
//  }
export function updateMultipleNotifications(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const ids = req.body.ids;
  const updateQuery = req.body.query;
  let counter = 0;
  ids.forEach((element: string) => {
    const result = global.updateItemById(element, table_name, updateQuery);
    result.then((value) => {
      counter++;
      if(counter == ids.length && value.acknowledged != false) {
        res.status(204).send();
      }else{
				globalTools.logToDatabase("function updateMultipleNotification failed", "error");
				res.status(400).send("Error");
			}
    });
  });
}

// updates multiple notifications by field and value
// /notifications/{field}&{value}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/notifications/published&true
// example body:
//   {
//      "content":"custom content"
// }
export function updateNotificationsByQuery(req: Request, res: Response) {
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

  const updateQuery = req.body;
  let query = { [field]: JSON.parse(value) };
  const result = global.updateItemsByField(query, table_name, updateQuery);
  result.then((value) => {
		if(value.acknowledged){
			res.status(204).send();
		}else{
			globalTools.logToDatabase("function updateNotificationsByQuery failed", "error");
			res.status(400).send("Error");
		} 
  });
}

// replaces notification by id with new notification passed in request body
// /notification/{id}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/notification/6490d3e5982efd2fe9136154
// example body:
//   {
//      "content":"custom content"
// }
export function replaceNotification(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const id = req.params.id;
  const query = req.body;
  let notification: Notification;
  notification = new Notification(query.content);
  const result = global.replaceItemById(id, table_name, notification);
  result.then((value) => {
		if(value.acknowledged){
			res.status(201).send();
		}else{
			globalTools.logToDatabase("function replaceNotification failed", "error");
			res.status(400).send("Error");
		} 
  });
}

// steals (returns a notification, but then deletes it from database) notification by id
// /stealnotification/{id}
// example:
//  http://localhost:3000/stealnotification/6490d3e5982efd2fe9136154
export function stealNotification(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const id = req.params.id;
  const result = global.stealItemById(id, table_name);
  result.then((value) => {
    let notification: Notification;
    notification = new Notification(
      value.value.content
    );
    res.status(201).send(notification);
  });
}
