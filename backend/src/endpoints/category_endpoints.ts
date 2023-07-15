import { Console } from 'console'
import express from 'express'
import e, { Request, Response } from 'express'
import {Category} from '../models/category_model';
import * as global from '../global_functions';

const table_name = 'categories';


// finds category by id
// /category/{id}
// example:
//  http://localhost:3000/category/648c6400e388683aeb23d331
export function getCategoryById(req: Request, res: Response) {
}

// finds all categories
// /categories
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/categories
export function getAllCategories(req: Request, res: Response) {
}


// finds category multiple categories by field and value
// /categories/{field}&{value}
// example:
//  http://localhost:3000/categories/name&custom_name
export function getCategoriesByQuery(req: Request, res: Response) {
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
}

// deletes category by id
// /category/{id}
// example:
//  http://localhost:3000/category/6490d3e5982efd2fe9136154
export function deleteCategory(req: Request, res: Response) {
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
}


// deletes multiple categories by field and value
// /categories/{field}&{value}
// example:
//  http://localhost:3000/categories/name&custom_name
export function deleteCategoriesByQuery(req: Request, res: Response) {
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
}

// updates multiple categories by array of ids
// /categories
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/categories
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
export function updateMultipleCategories(req: Request, res: Response) {
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
}


// TODO: poprawić w notatkach najpierw
export function replaceCategory(req: Request, res: Response) {
}


// steals (returns a category, but then deletes it from database) category by id
// /stealcategory/{id}
// example:
//  http://localhost:3000/stealcategory/6490d3e5982efd2fe9136154
export function stealCategory(req: Request, res: Response) {
}