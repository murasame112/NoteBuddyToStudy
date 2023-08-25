import { Console } from 'console'
import express from 'express'
import e, { Request, Response } from 'express'
import {Notification} from '../models/notification_model';
import * as global from '../global_functions';

const table_name = 'notifications';

// finds all notifications
// /notifications
// example:
//  http://localhost:3000/notifications
export function getAllNotifications(req: Request, res: Response) {
    const result = global.getAllItems(table_name);
    result.then((value)=> {
        res.send(value);
    });
}

// finds notification by id
// /notification/{id}
// example:
//  http://localhost:3000/notification/648c6400e388683aeb23d331
export function getNotificationById(req: Request, res: Response) {
    const id = req.params.id;
    const result = global.getItemById(id, table_name);
    let notification: Notification; 
    result.then((value) => {
        notification = new Notification(
            value.content,
						value.created_date
        );
        res.send(notification);   
    });
}

// finds multiple notifications by field and value
// /notifications/{field}&{value}
// example:
//  http://localhost:3000/notifications/published&true
export function getNotificationsByQuery(req: Request, res: Response) {
    const field = req.params.field;
    let value = req.params.value;
		try {
			value = JSON.parse(value);
		} catch (e: any){
			value = '"'+value+'"';
			value = JSON.parse(value);
		} 
    let query = {[field]: value};
    const result = global.getItemsByField(query, table_name);
    const notificationArray: Notification[] = []; 
    let notification: Notification;
    result.then((value) => {
        value.forEach((element: Notification) => {
            
            notification = new Notification(
                element.content,
								element.created_date
            );
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
    const notification: Notification = new Notification(
        req.body.content,
				req.body.created_date
    );
    const result = global.insertItem(notification, table_name);
    result.then((value) => {
        (value.acknowledged ? res.status(201).send('id: ' + value.insertedId) : res.status(400).send('Error'));
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
//     {
//        "name":"custom name",
//        "adress":"custom adress",
//        "author_id":{"$oid":"64a49ff9a1caf26fbfaa2dbb"},
//        "category_id":{"$oid":"64a4a1d1a1caf26fbfaa2dc1"},
//        "sucategory_id":{"$oid":"64a4a367a1caf26fbfaa2dcc"},
//        "description":"custom description"
//     },
    // {
    //    "content":"custom content"
    // }
//  ]
export function insertMultipleNotifications(req: Request, res: Response) {
    const notifications = req.body;
    let counter = 0;
    notifications.forEach((element: Notification) => {
        const notification: Notification = new Notification(
            element.content,
						element.created_date
        );
            
        const result = global.insertItem(notification, table_name);
        result.then((value) => {
            counter ++;
            if(value.acknowledged == false){
                res.status(400).send('Error');
            }
            if(counter == notifications.length){
                res.status(204).send();
            }
        });
    });
}

// deletes notification by id
// /notification/{id}
// example:
//  http://localhost:3000/notification/6490d3e5982efd2fe9136154
export function deleteNotification(req: Request, res: Response) {
    const id = req.params.id;
    const result = global.deleteItemById(id, table_name);
    result.then((value) => {
        (value.acknowledged ? res.status(204).send() : res.status(400).send('Error'));
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
    const ids = req.body;
    let counter = 0;
    ids.forEach((element: string) => {
            
        const result = global.deleteItemById(element, table_name);
        result.then((value) => {
            counter ++;
            if(value.acknowledged == false){
                res.status(400).send('Error');
            }
            if(counter == ids.length){
                res.status(204).send();
            }
        });
    });
}


// deletes multiple notifications by field and value
// /notifications/{field}&{value}
// example:
//  http://localhost:3000/notifications/published&true
export function deleteNotificationsByQuery(req: Request, res: Response) {
    const field = req.params.field;
    let value = req.params.value;
		try {
				value = JSON.parse(value);
		} catch (e: any){
				value = '"'+value+'"';
				value = JSON.parse(value);
		} 
    let query = {[field]: value};
    const result = global.deleteItemsByField(query, table_name);
    result.then((value) => {
        (value.acknowledged ? res.status(201).send() : res.status(400).send('Error'));
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
//      "name":"custom name",
//      "description":"custom description"
// }
export function updateNotification(req: Request, res: Response) {
    const id = req.params.id;
    const query = req.body;
    const result = global.updateItemById(id, table_name, query);
    result.then((value) => {
        (value.acknowledged ? res.status(204).send() : res.status(400).send('Error'));
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
//     "ids":[
//      ["6490d9efdfd298aad1e8f134",
//      "6490d9f9dfd298aad1e8f135",
//      "6490d9fddfd298aad1e8f136"]
//     ],
//     "query":{
//        "name":"custom name",
//        "description":"custom description"
//     }
//  }
export function updateMultipleNotifications(req: Request, res: Response) {
    const ids = req.body.ids;
    const updateQuery = req.body.query;
    let counter = 0;
    ids.forEach((element: string) => {
            
        const result = global.updateItemById(element, table_name, updateQuery);
        result.then((value) => {
            counter ++;
            if(value.acknowledged == false){
                res.status(400).send('Error');
            }
            if(counter == ids.length){
                res.status(204).send();
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
//      "name":"custom name",
//      "description":"custom description"
// }
export function updateNotificationsByQuery(req: Request, res: Response) {
    const field = req.params.field;
    const value = req.params.value;
    const updateQuery = req.body;
    let query = {[field]: JSON.parse(value)};
    const result = global.updateItemsByField(query, table_name, updateQuery);
    result.then((value) => {
        (value.acknowledged ? res.status(204).send() : res.status(400).send('Error'));
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
    const id = req.params.id;
    const query = req.body;
    let notification: Notification;
    notification = new Notification(
        query.content,
				query.created_date
    );
    const result = global.replaceItemById(id, table_name, notification);
    result.then((value) => {
        (value.acknowledged ? res.status(201).send() : res.status(400).send('Error'));
    });
}


// steals (returns a notification, but then deletes it from database) notification by id
// /stealnotification/{id}
// example:
//  http://localhost:3000/stealnotification/6490d3e5982efd2fe9136154
export function stealNotification(req: Request, res: Response) {
    const id = req.params.id;
    const result = global.stealItemById(id, table_name);
    result.then((value) => {
        let notification: Notification;
        notification = new Notification(
            value.value.content,
						value.value.created_date
        );
        res.status(201).send(notification);
    });
}