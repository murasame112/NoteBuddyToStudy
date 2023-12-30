import { Console } from "console";
import { ObjectId } from "bson";
import express from "express";
import e, { Request, Response } from "express";
import { Category } from "../models/category_model";
import * as global from "../global_database_functions";
import * as globalTools from "../global_tools";
import * as loginService from "../services/login"

const table_name = "categories";


// finds all categories
// /categories
// example:
//  http://localhost:3000/categories
export function getAllCategories(req: Request, res: Response) {
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

// finds category by id
// /category/{id}
// example:
//  http://localhost:3000/category/648c6400e388683aeb23d331
export function getCategoryById(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}

  const id = req.params.id;
  const result = global.getItemById(id, table_name);
  let cat: Category;
  result.then((value) => {
    cat = new Category(value.name, value._id);
    res.send(cat);
  });
}

// finds multiple categories by field and value
// /categories/{field}&{value}
// example:
//  http://localhost:3000/categories/name&custom_name
export function getCategoriesByQuery(req: Request, res: Response) {
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
  const catArray: Category[] = [];
  let cat: Category;
  result.then((value) => {
    value.forEach((element: Category) => {
      cat = new Category(element.name, element._id);
      catArray.push(cat);
    });
    res.send(catArray);
  });
}

// inserts category to database
// /category
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/category
// example body:
//   {
//      "name":"custom name",
// }
export function insertCategory(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}

  const cat: Category = new Category(req.body.name);
  const result = global.insertItem(cat, table_name);
  result.then((value) => {
    if(value.acknowledged){
			res.status(201).send(value.insertedId);
		}else{
			globalTools.logToDatabase("function insertCategory failed", "error");
			res.status(400).send("Error");
		}
  });
}

// inserts multiple categories to database
// /categories
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/categories
// example body:
// [
//     {
//        "name":"custom name",
//     },
// {
//    "name":"custom name2",
// }
//  ]
export function insertMultipleCategories(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}

  const categories = req.body;
  let counter = 0;
  categories.forEach((element: Category) => {
    const cat: Category = new Category(element.name);

    const result = global.insertItem(cat, table_name);
    result.then((value) => {
      counter++;
      if(counter == categories.length && value.acknowledged != false) {
        res.status(201).send();
      }else{
				globalTools.logToDatabase("function insertMultipleCategories failed", "error");
				res.status(400).send("Error");
			}
    });
  });
}

// deletes category by id
// /category/{id}
// example:
//  http://localhost:3000/category/6490d3e5982efd2fe9136154
export function deleteCategory(req: Request, res: Response) {
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
			globalTools.logToDatabase("function deleteCategory failed", "error");
			res.status(400).send("Error");
		}
  });
}

// deletes multiple categories by array of ids
// /categories
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/categories
// example body:
//  ["6490d9efdfd298aad1e8f134",
//  "6490d9f9dfd298aad1e8f135",
//  "6490d9fddfd298aad1e8f136"]

export function deleteMultipleCategories(req: Request, res: Response) {
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
				globalTools.logToDatabase("function deleteMultipleCategories failed", "error");
				res.status(400).send("Error");
			}
    });
  });
}

// deletes multiple categories by field and value
// /categories/{field}&{value}
// example:
//  http://localhost:3000/categories/name&custom_name
export function deleteCategoriesByQuery(req: Request, res: Response) {
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
			globalTools.logToDatabase("function deleteCategoriesByQuery failed", "error");
			res.status(400).send("Error");
		}
  });
}

// updates category by id with values passed in request body
// /category/{id}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/category/6490d3e5982efd2fe9136154
// example body:
//   {
//      "name":"custom name"
// }
export function updateCategory(req: Request, res: Response) {
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
  }

  const result = global.updateItemById(id, table_name, query);
  result.then((value) => {
		if(value.acknowledged){
			res.status(204).send();
		}else{
			globalTools.logToDatabase("function updateCategory failed", "error");
			res.status(400).send("Error");
		}
  });
}

// updates multiple categories by array of ids
// /categories
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/categories
// example body:
// {
//     "ids":
//      ["6490d9efdfd298aad1e8f134",
//      "6490d9f9dfd298aad1e8f135",
//      "6490d9fddfd298aad1e8f136"]
//     ,
//     "query":{
//        "name":"custom name"
//     }
//  }
export function updateMultipleCategories(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}

  const ids = req.body.ids;
  const updateQuery = req.body.query;

	if (typeof updateQuery._id !== "undefined") {
    updateQuery._id = new ObjectId(updateQuery._id);
  }

  let counter = 0;
  ids.forEach((element: string) => {
    const result = global.updateItemById(element, table_name, updateQuery);
    result.then((value) => {
      counter++;
      if(counter == ids.length && value.acknowledged != false) {
        res.status(204).send();
      }else{
				globalTools.logToDatabase("function updateMultipleCategories failed", "error");
				res.status(400).send("Error");
			}
    });
  });
}

// updates multiple categories by field and value
// /categories/{field}&{value}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/categories/name&custom_name
// example body:
//   {
//      "name":"custom name"
// }
export function updateCategoriesByQuery(req: Request, res: Response) {
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

	if (typeof updateQuery._id !== "undefined") {
    updateQuery._id = new ObjectId(updateQuery._id);
  }

  let query = { [field]: JSON.parse(value) };
  const result = global.updateItemsByField(query, table_name, updateQuery);
  result.then((value) => {
		if(value.acknowledged){
			res.status(204).send();
		}else{
			globalTools.logToDatabase("function updateCategoriesByQuery failed", "error");
			res.status(400).send("Error");
		}
  });
}

// replaces category by id with new category passed in request body
// /category/{id}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/category/6490d3e5982efd2fe9136154
// example body:
//   {
//      "name":"custom name"
// }
export function replaceCategory(req: Request, res: Response) {
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

  let category: Category;
  category = new Category(query.name, query._id);
  const result = global.replaceItemById(id, table_name, category);
  result.then((value) => {
		if(value.acknowledged){
			res.status(201).send();
		}else{
			globalTools.logToDatabase("function replaceCategory failed", "error");
			res.status(400).send("Error");
		}
  });
}

// steals (returns a category, but then deletes it from database) category by id
// /stealcategory/{id}
// example:
//  http://localhost:3000/stealcategory/6490d3e5982efd2fe9136154
export function stealCategory(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	if(!loginService.checkIfLogged(token)){
		res.status(401).send("Error - unauthorized");
		return false;
	}
	
  const id = req.params.id;
  const result = global.stealItemById(id, table_name);
  result.then((value) => {
    let category: Category;
    category = new Category(value.value.name, value.value._id);
    res.status(201).send(category);
  });
}
