import { Console } from 'console'
import express from 'express'
import e, { Request, Response } from 'express'
import {Note} from '../models/note_model';
import * as global from '../global_functions';

const table_name = 'notes';

export function helloWorld(req: Request, res: Response) {
    res.send('howdy, world');
}

export function getNoteById(req: Request, res: Response) {
    const id = req.params.id;
    const noteProm = global.getItemById(id, table_name);
    let note: Note; 
    noteProm.then((value) => {
        note = new Note(
            value._name, 
            value._author_id, 
            value._category_id, 
            value._subcategory_id, 
            value._adress, 
            value._description, 
            value._shared_date, 
            value._last_edit_date, 
            value._published, 
            value._positive_reviews, 
            value._negative_reviews
        );
        res.send(note);   
      });
}


// get multiple (spelniajace warunek, tu bedzie pewnie pare warunkow)
// ogolnie pewnie wszystkie z funkcji co sa w bazie, co