import { Console } from 'console'
import express from 'express'
import e, { Request, Response } from 'express'
import {Note} from '../models/note_model';
import * as global from '../global_functions';

const table_name = 'notes';

export function getNoteById(req: Request, res: Response) {
    const id = req.params.id;
    const noteProm = global.getItemById(id, table_name);
    let note: Note; 
    noteProm.then((value) => {
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

export function getNotesByQuery(req: Request, res: Response) {
    const field = req.params.field;
    const value = req.params.value;
    let query = {[field]: JSON.parse(value)};
    const noteArrayProm = global.getItemsByField(query, table_name);
    const noteArray: Note[] = []; 
    let note: Note;
    noteArrayProm.then((value) => {
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
        (value.acknowledged ? res.status(201).send(value.insertedId) : res.status(400).send('Error'));
    });

}


// ogolnie pewnie wszystkie z funkcji co sa w bazie, co