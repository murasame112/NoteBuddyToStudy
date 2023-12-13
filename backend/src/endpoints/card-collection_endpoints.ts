// there are no ByQuery endpoints here, as there's no possible way (check model)

import { Console } from "console";
import { ObjectId } from "bson";
import express from "express";
import e, { Request, Response } from "express";
import { CardCollection } from "../models/card-collection_model";
import * as global from "../global_database_functions";
import * as globalTools from "../global_tools";
import * as loginService from "../services/login"

const table_name = "card_collections";

// finds all cardcollections
// /cardcollections
// example:
//  http://localhost:3000/cardcollections
export function getAllCardCollections(req: Request, res: Response) {
	const result = global.getAllItems(table_name);
		result.then((value) => {
			res.send(value);
	});
  
}

// finds cardcollection by id
// /cardcollection/{id}
// example:
//  http://localhost:3000/cardcollection/648c6400e388683aeb23d331
export function getCardCollectionById(req: Request, res: Response) {
  const id = req.params.id;
  const result = global.getItemById(id, table_name);
  let cardcollection: CardCollection;
  result.then((value) => {
    cardcollection = new CardCollection(
			value.cards
			);
    res.send(cardcollection);
  });
}

// finds multiple cardcollections by id_field and value of objectId
// /cardcollectionsid/{field}&{value}
// example:
//  http://localhost:3000/cardcollectionsid/cards&6490d9efdfd298aad1e8f134
export function getCardCollectionsByQueriedId(req: Request, res: Response) {
  const field = req.params.field;
  const value = req.params.value;
  const objValue = new ObjectId(value);

  let query = { [field]: objValue };
  const result = global.getItemsByField(query, table_name);
  const cardcollectionArray: CardCollection[] = [];
  let cardcollection: CardCollection;
  result.then((value) => {
    value.forEach((element: CardCollection) => {
      cardcollection = new CardCollection(
				element.cards
				);
      cardcollectionArray.push(cardcollection);
    });
    res.send(cardcollectionArray);
  });
}

// inserts cardcollection to database
// /cardcollection
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/cardcollection
// example body:
// {
// "cards":[
//    "64a49ff9a1caf26fbfaa2dbb",
//		"64a49ff9a1caf26fbfaa2faf",
// ]
//  }
export function insertCardCollection(req: Request, res: Response) {

	let cards: ObjectId[] = [];

	req.body.cards.forEach((element: string) => {
    let card = new ObjectId(element);
    cards.push(card);
  });
  const cardcollection: CardCollection = new CardCollection(
			cards
		);

  const result = global.insertItem(cardcollection, table_name);
  result.then((value) => {
    if(value.acknowledged){
			res.status(201).send(value.insertedId);
		}else{
			globalTools.logToDatabase("function insertCardCollection failed", "error");
			res.status(400).send("Error");
		}
  });
}

// inserts multiple cardcollections to database
// /cardcollections
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/cardcollections
// example body:
// [
// {
// "cards":[
//    "64a49ff9a1caf26fbfaa2dbb",
//		"64a49ff9a1caf26fbfaa2faf",
// ]
//  },
// {
// "cards":[
//    "64a49ff9a1csadd3dwwqdwqd2",
//		"64a49ff9a1caf2sdfaaki23",
// ]
//  }
//  ]
export function insertMultipleCardCollections(req: Request, res: Response) {
  const cardcollections = req.body;
  let counter = 0;
	
  cardcollections.forEach((element: any) => {
    // TODO: przemyśleć, czy tu powinno byc any?
    let cardsIds: ObjectId[] = [];
		if(!Array.isArray(element.cards) || element.cards.length == 0){
			res.status(400).send("Error");
			return false;
		}
    element.cards.forEach((elem: string) => {
      let card = new ObjectId(elem);
      cardsIds.push(card);
    });
		const cardcollection: CardCollection = new CardCollection(
				cardsIds
			);

    const result = global.insertItem(cardcollection, table_name);
    result.then((value) => {
      counter++;
			if(counter == cardcollections.length && value.acknowledged != false) {
        res.status(201).send();
      }else{
				globalTools.logToDatabase("function insertMultipleCardCollections failed", "error");
				res.status(400).send("Error");
			}
    });
  });
}

// deletes cardcollection by id
// /cardcollection/{id}
// example:
//  http://localhost:3000/cardcollection/6490d3e5982efd2fe9136154
export function deleteCardCollection(req: Request, res: Response) {
  const id = req.params.id;
  const result = global.deleteItemById(id, table_name);
  result.then((value) => {
		if(value.acknowledged){
			res.status(204).send();
		}else{
			globalTools.logToDatabase("function deleteCardCollection failed", "error");
			res.status(400).send("Error");
		}
  });
}

// deletes multiple cardcollections by array of ids
// /cardcollections
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/cardcollections
// example body:
//  ["6490d9efdfd298aad1e8f134",
//  "6490d9f9dfd298aad1e8f135",
//  "6490d9fddfd298aad1e8f136"]

export function deleteMultipleCardCollections(req: Request, res: Response) {
  const ids = req.body;
  let counter = 0;
  ids.forEach((element: string) => {
    const result = global.deleteItemById(element, table_name);
    result.then((value) => {
      counter++;
      if(counter == ids.length && value.acknowledged != false){
				res.status(204).send();
      }else{
				globalTools.logToDatabase("function deleteMultipleCardCollections failed", "error");
        res.status(400).send("Error");
      }
    });
  });
}


// deletes multiple cardcollections by id_field and value of objectId
// /cardcollectionsid/{field}&{value}
// example:
//  http://localhost:3000/cardcollectionsid/note_id&6490d9efdfd298aad1e8f134
export function deleteCardCollectionsByQueriedId(req: Request, res: Response) {
  const field = req.params.field;
  const value = req.params.value;
  const objValue = new ObjectId(value);

  let query = { [field]: objValue };
  const result = global.deleteItemsByField(query, table_name);
  result.then((value) => {
		if(value.acknowledged){
			res.status(204).send();
		}else{
			globalTools.logToDatabase("function deleteCardCollectionsByQueriedId failed", "error");
			res.status(400).send("Error");
		}
  });
}

// updates cardcollection by id with values passed in request body
// /cardcollection/{id}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/cardcollection/6490d3e5982efd2fe9136154
// example body:
// {
// "cards":[
//    "64a49ff9a1caf26fbfaa2dbb",
//		"64a49ff9a1caf26fbfaa2faf",
// ]
//  }
export function updateCardCollection(req: Request, res: Response) {
  const id = req.params.id;
  const query = req.body;

	let card: ObjectId;
  if (typeof query.cards !== "undefined") {
    let cardsIds: ObjectId[] = [];

    query.cards.forEach((elem: string) => {
      card = new ObjectId(elem);
      cardsIds.push(card);
    });

    query.users = cardsIds;
  }

  const result = global.updateItemById(id, table_name, query);
  result.then((value) => {
		if(value.acknowledged){
			res.status(204).send();
		}else{
			globalTools.logToDatabase("function updateCardCollection failed", "error");
			res.status(400).send("Error");
		}
  });
}

// updates multiple cardcollections by array of ids
// /cardcollections
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/cardcollections
// example body:
// {
//     "ids":
//      ["6490d9efdfd298aad1e8f134",
//      "6490d9f9dfd298aad1e8f135",
//      "6490d9fddfd298aad1e8f136"]
//     ,
// 	"cards":[
//    "64a49ff9a1caf26fbfaa2dbb",
//		"64a49ff9a1caf26fbfaa2faf",
// ]
//  }
//  }
export function updateMultipleCardCollections(req: Request, res: Response) {
  const ids = req.body.ids;
	let updateQuery = req.body.query;

	let card: ObjectId;

  if (typeof updateQuery.cards !== "undefined") {
    let cardsIds: ObjectId[] = [];

    updateQuery.cards.forEach((elem: string) => {
      card = new ObjectId(elem);
      cardsIds.push(card);
    });

    updateQuery.cards = cardsIds;
  }
  let counter = 0;
  ids.forEach((element: string) => {
    const result = global.updateItemById(element, table_name, updateQuery);
    result.then((value) => {
      counter++;
      if(counter == ids.length && value.acknowledged != false) {
        res.status(204).send();
      }else{
				globalTools.logToDatabase("function updateMultipleCardCollections failed", "error");
				res.status(400).send("Error");
			}
    });
  });
}

// updates multiple cardcollections by id_field and value of objectId
// /cardcollectionsid/{field}&{value}
// example:
//  http://localhost:3000/cardcollectionsid/cards&6490d9efdfd298aad1e8f134
// example body:
// {
// "cards":[
//    "64a49ff9a1caf26fbfaa2dbb",
//		"64a49ff9a1caf26fbfaa2faf",
// ]
//  }
export function updateCardCollectionsByQueriedId(req: Request, res: Response) {
  const field = req.params.field;
  let value = req.params.value;
  const objValue = new ObjectId(value);

  let updateQuery = req.body;
 
	let card: ObjectId;
	if (typeof updateQuery.cards !== "undefined") {
    let cardsIds: ObjectId[] = [];

    updateQuery.cards.forEach((elem: string) => {
      card = new ObjectId(elem);
      cardsIds.push(card);
    });

    updateQuery.cards = cardsIds;
  }

  let query = { [field]: objValue };

  const result = global.updateItemsByField(query, table_name, updateQuery);
  result.then((value) => {
		if(value.acknowledged){
			res.status(204).send();
		}else{
			globalTools.logToDatabase("function updateCardCollectionsByQueriedId failed", "error");
			res.status(400).send("Error");
		}
  });
}

// replaces cardcollection by id with new cardcollection passed in request body
// /cardcollection/{id}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/cardcollection/6490d3e5982efd2fe9136154
// example body:
// {
// "cards":[
//    "64a49ff9a1caf26fbfaa2dbb",
//		"64a49ff9a1caf26fbfaa2faf",
// ]
//  }
export function replaceCardCollection(req: Request, res: Response) {
  const id = req.params.id;
  const query = req.body;

	let cards: ObjectId[] = [];
	req.body.cards.forEach((element: string) => {
    let card = new ObjectId(element);
    cards.push(card);
  });
  const cardcollection: CardCollection = new CardCollection(
			cards
		);
  
		const result = global.replaceItemById(id, table_name, cardcollection);
  result.then((value) => {
		if(value.acknowledged){
			res.status(201).send();
		}else{
			globalTools.logToDatabase("function replaceCardCollection failed", "error");
			res.status(400).send("Error");
		}
  });
}

// steals (returns a cardcollection, but then deletes it from database) cardcollection by id
// /stealcardcollection/{id}
// example:
//  http://localhost:3000/stealcardcollection/6490d3e5982efd2fe9136154
export function stealCardCollection(req: Request, res: Response) {
  const id = req.params.id;
  const result = global.stealItemById(id, table_name);
  result.then((value) => {
    let cardcollection: CardCollection;
    cardcollection = new CardCollection(
			value.value.cards
			);
    res.status(201).send(cardcollection);
  });
}