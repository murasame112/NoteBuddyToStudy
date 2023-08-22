import { Console } from 'console'
import { ObjectId } from 'bson';
import express from 'express'
import e, { Request, Response } from 'express'
import {Subcategory} from '../models/subcategory_model';
import * as global from '../global_functions';

const table_name = 'subcategories';

// finds all subcategories
// /subcategories
// example:
//  http://localhost:3000/subcategories
export function getAllSubcategories(req: Request, res: Response) {
    const result = global.getAllItems(table_name);
    result.then((value)=> {
        res.send(value);
    });
}

// finds subcategory by id
// /subcategory/{id}
// example:
//  http://localhost:3000/subcategory/648c6400e388683aeb23d331
export function getSubcategoryById(req: Request, res: Response) {
    const id = req.params.id;
    const result = global.getItemById(id, table_name);
    let subcategory: Subcategory; 
    result.then((value) => {
        subcategory = new Subcategory(
            // value.name, 
            // value.category_id
            value.category_id,
            value.name
        );
        res.send(subcategory);   
    });
}


// finds multiple subcategories by field and value
// /subcategories/{field}&{value}
// example:
//  http://localhost:3000/subcategories/published&true
export function getSubcategoriesByQuery(req: Request, res: Response) {
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
    const subcategoryArray: Subcategory[] = []; 
    let subcategory: Subcategory;
    result.then((value) => {
        value.forEach((element: Subcategory) => {
            
            subcategory = new Subcategory(  
                element.category_id,
                element.name
            );
            subcategoryArray.push(subcategory);

        });
        res.send(subcategoryArray);   
    });
}

// finds multiple subcategories by id_field and value of objectId
// /subcategoriesid/{field}&{value}
// example:
//  http://localhost:3000/subcategoriesid/note&6490d9efdfd298aad1e8f134
export function getSubcategoriesByQueriedId(req: Request, res: Response) {
    const field = req.params.field;
    const value = req.params.value;
    const objValue = new ObjectId(value);
    
    let query = {[field]: (objValue)};
    const result = global.getItemsByField(query, table_name);
    const subcategoryArray: Subcategory[] = []; 
    let subcategory: Subcategory;
    result.then((value) => {
        value.forEach((element: Subcategory) => {
            
            subcategory = new Subcategory(  
                element.category_id,
                element.name
            );
            subcategoryArray.push(subcategory);

        });
        res.send(subcategoryArray);   
    });
}

// inserts subcategory to database
// /subcategory
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/subcategory
// example body:
//   {
//      "name":"custom name",
//      "category_id":"some id"
// }
export function insertSubcategory(req: Request, res: Response) {
    const subcategory: Subcategory = new Subcategory(
        req.body.category_id,
        req.body.name
    );
    const result = global.insertItem(subcategory, table_name);
    result.then((value) => {
        (value.acknowledged ? res.status(201).send('id: ' + value.insertedId) : res.status(400).send('Error'));
    });
}


// inserts multiple subcategories to database
// /subcategories
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/subcategories
// example body:
// [
//     {
//        "name":"custom name",
//        "category_id":{"$oid":"64a4a1d1a1caf26fbfaa2dc1"}
//     },
    // {
    //    "name":"custom name2"
    //    "category_id":{"$oid":"64a4a1d1a1caf26fbfaa2dc1"}
    // }
//  ]
export function insertMultipleSubcategories(req: Request, res: Response) {
    const subcategories = req.body;
    let counter = 0;
    subcategories.forEach((element: Subcategory) => {
        const subcategory: Subcategory = new Subcategory(
            element.category_id,
            element.name
        );
            
        const result = global.insertItem(subcategory, table_name);
        result.then((value) => {
            counter ++;
            if(value.acknowledged == false){
                res.status(400).send('Error');
            }
            if(counter == subcategories.length){
                res.status(204).send();
            }
        });
    });
}

// deletes subcategory by id
// /subcategory/{id}
// example:
//  http://localhost:3000/subcategory/6490d3e5982efd2fe9136154
export function deleteSubcategory(req: Request, res: Response) {
    const id = req.params.id;
    const result = global.deleteItemById(id, table_name);
    result.then((value) => {
        (value.acknowledged ? res.status(204).send() : res.status(400).send('Error'));
    });
}

// deletes multiple subcategories by array of ids
// /subcategories
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/subcategory
// example body:
//  ["6490d9efdfd298aad1e8f134",
//  "6490d9f9dfd298aad1e8f135",
//  "6490d9fddfd298aad1e8f136"]

export function deleteMultipleSubcategories(req: Request, res: Response) {
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


// deletes multiple subcategories by field and value
// /subcategories/{field}&{value}
// example:
//  http://localhost:3000/subcategories/published&true
export function deleteSubcategoriesByQuery(req: Request, res: Response) {
    const field = req.params.field;
    const value = req.params.value;
    let query = {[field]: JSON.parse(value)};
    const result = global.deleteItemsByField(query, table_name);
    result.then((value) => {
        (value.acknowledged ? res.status(201).send() : res.status(400).send('Error'));
    }); 
}

// updates subcategory by id with values passed in request body
// /subcategory/{id}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/subcategory/6490d3e5982efd2fe9136154
// example body:
//   {
//      "name":"custom name"
// }
export function updateSubcategory(req: Request, res: Response) {
    const id = req.params.id;
    const query = req.body;
    const result = global.updateItemById(id, table_name, query);
    result.then((value) => {
        (value.acknowledged ? res.status(204).send() : res.status(400).send('Error'));
    });
}

// updates multiple subcategories by array of ids
// /subcategories
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/subcategory
// example body:
// {
//     "ids":[
//      ["6490d9efdfd298aad1e8f134",
//      "6490d9f9dfd298aad1e8f135",
//      "6490d9fddfd298aad1e8f136"]
//     ],
//     "query":{
//        "name":"custom name"
//     }
//  }
export function updateMultipleSubcategories(req: Request, res: Response) {
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

// updates multiple subcategories by field and value
// /subcategories/{field}&{value}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/subcategories/published&true
// example body:
//   {
//      "name":"custom name",
//      "description":"custom description"
// }
export function updateSubcategoriesByQuery(req: Request, res: Response) {
    const field = req.params.field;
    const value = req.params.value;
    const updateQuery = req.body;
    let query = {[field]: JSON.parse(value)};
    const result = global.updateItemsByField(query, table_name, updateQuery);
    result.then((value) => {
        (value.acknowledged ? res.status(204).send() : res.status(400).send('Error'));
    }); 
}


// replaces subcategory by id with new subcategory passed in request body
// /subcategory/{id}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/subcategory/6490d3e5982efd2fe9136154
// example body:
//   {
//      "name":"custom name",
//      "category_id":"some id"
// }
export function replaceSubcategory(req: Request, res: Response) {
    const id = req.params.id;
    const query = req.body;
    let subcategory: Subcategory;
    subcategory = new Subcategory(
        query.category_id,
        query.name
    );
    const result = global.replaceItemById(id, table_name, subcategory);
    result.then((value) => {
        (value.acknowledged ? res.status(201).send() : res.status(400).send('Error'));
    });
}


// steals (returns a subcategory, but then deletes it from database) subcategory by id
// /stealsubcategory/{id}
// example:
//  http://localhost:3000/stealsubcategory/6490d3e5982efd2fe9136154
export function stealSubcategory(req: Request, res: Response) {
    const id = req.params.id;
    const result = global.stealItemById(id, table_name);
    result.then((value) => {
        let subcategory: Subcategory;
        subcategory = new Subcategory(
            value.value.category_id,
            value.value.name
        );
        res.status(201).send(subcategory);
    });
}