import { Console } from 'console'
import { ObjectId } from 'bson';
import express from 'express'
import e, { Request, Response } from 'express'
import {Card} from '../models/card_model';
import * as global from '../global_functions';

const table_name = 'cards';

// finds all cards
// /cards
// example:
//  http://localhost:3000/cards
export function getAllCards(req: Request, res: Response) {
    const result = global.getAllItems(table_name);
    result.then((value)=> {
        res.send(value);
    });
}

// finds card by id
// /card/{id}
// example:
//  http://localhost:3000/card/648c6400e388683aeb23d331
export function getCardById(req: Request, res: Response) {
    const id = req.params.id;
    const result = global.getItemById(id, table_name);
    let card: Card; 
    result.then((value) => {
        card = new Card(
            value.questions,
            value.answers
        );
        res.send(card);   
    });
}

// finds multiple cards by field and value
// /cards/{field}&{value}
// example:
//  http://localhost:3000/cards/published&true
export function getCardsByQuery(req: Request, res: Response) {
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
    const cardArray: Card[] = []; 
    let card: Card;
    result.then((value) => {
        value.forEach((element: Card) => {
            
            card = new Card(
                element.questions,
                element.answers
            );
            cardArray.push(card);

        });
        res.send(cardArray);   
    });
}

// finds multiple cards by id_field and value of objectId
// /cardsid/{field}&{value}
// example:
//  http://localhost:3000/cardsid/category_id&6490d9efdfd298aad1e8f134
export function getCardsByQueriedId(req: Request, res: Response) {
    const field = req.params.field;
    const value = req.params.value;
    const objValue = new ObjectId(value);
    
    let query = {[field]: (objValue)};
    const result = global.getItemsByField(query, table_name);
    const cardArray: Card[] = []; 
    let card: Card;
    result.then((value) => {
        value.forEach((element: Card) => {
            
            card = new Card(
                element.questions,
                element.answers 
            );
            cardArray.push(card);

        });
        res.send(cardArray);   
    });
}

// inserts card to database
// /card
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/card
// example body:
// {
//     "questions":[
//        "aaaaaa?",
//        "bbbbbb?",
//        "cccccc?"
//     ],
//     "answers":[
//        "xxxxxxxxx",
//        "yyyyyyyyy",
//        "zzzzzzzzz"
//     ]
//  }
export function insertCard(req: Request, res: Response) {
    const card: Card = new Card(
        req.body.questions,
        req.body.answers 
    );
    const result = global.insertItem(card, table_name);
    result.then((value) => {
        (value.acknowledged ? res.status(201).send('id: ' + value.insertedId) : res.status(400).send('Error'));
    });
}


// inserts multiple cards to database
// /cards
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/cards
// example body:
// [
// {
//     "questions":[
//        "111111?",
//        "2222?",
//        "333333?"
//     ],
//     "answers":[
//        "999999",
//        "8888888",
//        "7777777"
//     ]
//  },
// {
//     "questions":[
//        "aaaaaa?",
//        "bbbbbb?",
//        "cccccc?"
//     ],
//     "answers":[
//        "xxxxxxxxx",
//        "yyyyyyyyy",
//        "zzzzzzzzz"
//     ]
//  }
//  ]
export function insertMultipleCards(req: Request, res: Response) {
    const cards = req.body;
    let counter = 0;
    cards.forEach((element: Card) => {
        const card: Card = new Card(
            element.questions,
            element.answers 
        );
            
        const result = global.insertItem(card, table_name);
        result.then((value) => {
            counter ++;
            if(value.acknowledged == false){
                res.status(400).send('Error');
            }
            if(counter == cards.length){
                res.status(204).send();
            }
        });
    });
}

// deletes card by id
// /card/{id}
// example:
//  http://localhost:3000/card/6490d3e5982efd2fe9136154
export function deleteCard(req: Request, res: Response) {
    const id = req.params.id;
    const result = global.deleteItemById(id, table_name);
    result.then((value) => {
        (value.acknowledged ? res.status(204).send() : res.status(400).send('Error'));
    });
}

// deletes multiple cards by array of ids
// /cards
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/cards
// example body:
//  ["6490d9efdfd298aad1e8f134",
//  "6490d9f9dfd298aad1e8f135",
//  "6490d9fddfd298aad1e8f136"]

export function deleteMultipleCards(req: Request, res: Response) {
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


// deletes multiple cards by field and value
// /cards/{field}&{value}
// example:
//  http://localhost:3000/cards/published&true
export function deleteCardsByQuery(req: Request, res: Response) {
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

// updates card by id with values passed in request body
// /card/{id}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/card/6490d3e5982efd2fe9136154
// example body:
// {
//     "questions":[
//        "aaaaaa?",
//        "bbbbbb?",
//        "cccccc?"
//     ],
//     "answers":[
//        "xxxxxxxxx",
//        "yyyyyyyyy",
//        "zzzzzzzzz"
//     ]
//  }
export function updateCard(req: Request, res: Response) {
    const id = req.params.id;
    const query = req.body;
    const result = global.updateItemById(id, table_name, query);
    result.then((value) => {
        (value.acknowledged ? res.status(204).send() : res.status(400).send('Error'));
    });
}

// updates multiple cards by array of ids
// /cards
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/cards
// example body:
// {
//     "ids":
//      ["6490d9efdfd298aad1e8f134",
//      "6490d9f9dfd298aad1e8f135",
//      "6490d9fddfd298aad1e8f136"]
//     ,
//     "query":{
//     "questions":[
//        "aaaaaa?",
//        "bbbbbb?",
//        "cccccc?"
//     ],
//     "answers":[
//        "xxxxxxxxx",
//        "yyyyyyyyy",
//        "zzzzzzzzz"
//     ]
//  }
//  }
export function updateMultipleCards(req: Request, res: Response) {
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

// updates multiple cards by field and value
// /cards/{field}&{value}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/cards/published&true
// example body:
// {
//     "questions":[
//        "aaaaaa?",
//        "bbbbbb?",
//        "cccccc?"
//     ],
//     "answers":[
//        "xxxxxxxxx",
//        "yyyyyyyyy",
//        "zzzzzzzzz"
//     ]
//  }
export function updateCardsByQuery(req: Request, res: Response) {
    const field = req.params.field;
    const value = req.params.value;
    const updateQuery = req.body;
    let query = {[field]: JSON.parse(value)};
    const result = global.updateItemsByField(query, table_name, updateQuery);
    result.then((value) => {
        (value.acknowledged ? res.status(204).send() : res.status(400).send('Error'));
    }); 
}


// replaces card by id with new card passed in request body
// /card/{id}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/card/6490d3e5982efd2fe9136154
// example body:
// {
//     "questions":[
//        "aaaaaa?",
//        "bbbbbb?",
//        "cccccc?"
//     ],
//     "answers":[
//        "xxxxxxxxx",
//        "yyyyyyyyy",
//        "zzzzzzzzz"
//     ]
//  }
export function replaceCard(req: Request, res: Response) {
    const id = req.params.id;
    const query = req.body;
    let card: Card;
    card = new Card(
        query.questions,
        query.answers 
    );
    const result = global.replaceItemById(id, table_name, card);
    result.then((value) => {
        (value.acknowledged ? res.status(201).send() : res.status(400).send('Error'));
    });
}


// steals (returns a card, but then deletes it from database) card by id
// /stealcard/{id}
// example:
//  http://localhost:3000/stealcard/6490d3e5982efd2fe9136154
export function stealCard(req: Request, res: Response) {
    const id = req.params.id;
    const result = global.stealItemById(id, table_name);
    result.then((value) => {
        let card: Card;
        card = new Card(
            value.value.questions,
            value.value.answers 
        );
        res.status(201).send(card);
    });
}