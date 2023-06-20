import { Console } from 'console'
import express from 'express'
import e, { Request, Response } from 'express'
import {Note} from '../models/note_model';
import * as global from '../global_functions';

const table_name = 'notes';

// finds note by id
// /note/{id}
// example:
//  http://localhost:3000/note/648c6400e388683aeb23d331
export function getNoteById(req: Request, res: Response) {
    const id = req.params.id;
    const result = global.getItemById(id, table_name);
    let note: Note; 
    result.then((value) => {
        note = new Note(
            value.name, 
            value.author_id, 
            value.category_id, 
            value.subcategory_id, 
            value.adress, 
            value.description, 
            value.shared_date, 
            value.last_edit_date, 
            value.published, 
            value.positive_reviews, 
            value.negative_reviews
        );
        res.send(note);   
    });
}

// TODO: przetestowac
// finds multiple notes by ids
// /notes
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/notes
// example body:
//  ["6490d9efdfd298aad1e8f134",
//  "6490d9f9dfd298aad1e8f135",
//  "6490d9fddfd298aad1e8f136"]
export function getMultipleNotes(req: Request, res: Response) {
    const ids = req.body;
    let counter = 0;
    const noteArray: Note[] = [];
    ids.forEach((element: string) => {
            
        const result = global.getItemById(element, table_name);
        result.then((value) => {
            counter ++;
            let note = new Note(
                value.name, 
                value.author_id, 
                value.category_id, 
                value.subcategory_id, 
                value.adress, 
                value.description, 
                value.shared_date, 
                value.last_edit_date, 
                value.published, 
                value.positive_reviews, 
                value.negative_reviews
            );
            noteArray.push(note);
            if(counter == ids.length){
                res.status(201).send(noteArray);
            }
        });
    });
}


// finds note multiple notes by field and value
// /notes/{field}&{value}
// example:
//  http://localhost:3000/note/published&true
export function getNotesByQuery(req: Request, res: Response) {
    const field = req.params.field;
    const value = req.params.value;
    let query = {[field]: JSON.parse(value)};
    const result = global.getItemsByField(query, table_name);
    const noteArray: Note[] = []; 
    let note: Note;
    result.then((value) => {
        value.forEach((element: Note) => {
            
            note = new Note(
                element.name, 
                element.author_id, 
                element.category_id, 
                element.subcategory_id, 
                element.adress, 
                element.description, 
                element.shared_date, 
                element.last_edit_date, 
                element.published, 
                element.positive_reviews, 
                element.negative_reviews
            );
            noteArray.push(note);

        });
        res.send(noteArray);   
    });
}

// inserts note to database
// /note
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/note
// example body:
//   {
//      "name":"custom name",
//      "adress":"custom adress",
//      "author_id":"some id",
//      "category_id":"some id",
//      "description":"custom description"
// }
export function insertNote(req: Request, res: Response) {
    const note: Note = new Note(req.body.name,
        req.body.author_id,
        req.body.category_id,
        req.body.subcategory_id,
        req.body.adress,
        req.body.description,
        req.body.shared_date,
        req.body.last_edit_date,
        req.body.published,
        req.body.positive_reviews,
        req.body.negative_reviews
    );
    const result = global.insertItem(note, table_name);
    result.then((value) => {
        (value.acknowledged ? res.status(201).send('id: ' + value.insertedId) : res.status(400).send('Error'));
    });
}

// deletes note by id
// /note/{id}
// example:
//  http://localhost:3000/note/6490d3e5982efd2fe9136154
export function deleteNote(req: Request, res: Response) {
    const id = req.params.id;
    const result = global.deleteItemById(id, table_name);
    result.then((value) => {
        (value.acknowledged ? res.status(204).send() : res.status(400).send('Error'));
    });
}

// deletes multiple notes by array of ids
// /notes
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/note
// example body:
//  ["6490d9efdfd298aad1e8f134",
//  "6490d9f9dfd298aad1e8f135",
//  "6490d9fddfd298aad1e8f136"]

export function deleteMultipleNotes(req: Request, res: Response) {
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

// TODO: przetestowac
// deletes multiple notes by field and value
// /notes/{field}&{value}
// example:
//  http://localhost:3000/notes/published&true
export function deleteNotesByQuery(req: Request, res: Response) {
    const field = req.params.field;
    const value = req.params.value;
    let query = {[field]: JSON.parse(value)};
    const result = global.deleteItemsByField(query, table_name);
    result.then((value) => {
        (value.acknowledged ? res.status(201).send() : res.status(400).send('Error'));
    }); 
}

// TODO: przetestowac
// updates note by id with values passed in request body
// /note/{id}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/note/6490d3e5982efd2fe9136154
// example body:
//   {
//      "name":"custom name",
//      "description":"custom description"
// }
export function updateNote(req: Request, res: Response) {
    const id = req.params.id;
    const query = req.body;
    const result = global.updateItemById(id, table_name, query);
    result.then((value) => {
        (value.acknowledged ? res.status(204).send() : res.status(400).send('Error'));
    });
}

// TODO: przetestowac
// updates multiple notes by array of ids
// /notes
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/note
// example body:
// {
//     "ids":[
//        "6490d9efdfd298aad1e8f134",
//        "6490d9f9dfd298aad1e8f135",
//        "6490d9fddfd298aad1e8f136"
//     ],
//     "query":{
//        "name":"custom name",
//        "description":"custom description"
//     }
//  }
export function updateMultipleNotes(req: Request, res: Response) {
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

// TODO: przetestowac
// updates multiple notes by field and value
// /notes/{field}&{value}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/notes/published&true
// example body:
//   {
//      "name":"custom name",
//      "description":"custom description"
// }
export function updateNotesByQuery(req: Request, res: Response) {
    const field = req.params.field;
    const value = req.params.value;
    const updateQuery = req.body;
    let query = {[field]: JSON.parse(value)};
    const result = global.updateItemsByField(query, table_name, updateQuery);
    result.then((value) => {
        (value.acknowledged ? res.status(204).send() : res.status(400).send('Error'));
    }); 
}


// TODO: przetestowac
// replaces note by id with new note passed in request body
// /note/{id}
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/note/6490d3e5982efd2fe9136154
// example body:
//   {
//      "name":"custom name",
//      "adress":"custom adress",
//      "author_id":"some id",
//      "category_id":"some id",
//      "description":"custom description"
// }
export function replaceNote(req: Request, res: Response) {
    const id = req.params.id;
    const query = req.body;
    const result = global.replaceItemById(id, table_name, query);
    result.then((value) => {
        (value.acknowledged ? res.status(201).send() : res.status(400).send('Error'));
    });
}


// TODO: przetestowac
// steals (returns a note, but then deletes it from database) note by id
// /stealnote/{id}
// example:
//  http://localhost:3000/stealnote/6490d3e5982efd2fe9136154
export function stealNote(req: Request, res: Response) {
    const id = req.params.id;
    const result = global.stealItemById(id, table_name);
    result.then((value) => {
        res.status(201).send(value.value);
    });
}

