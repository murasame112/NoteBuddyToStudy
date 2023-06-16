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

    
    res.sendStatus(200).send('hello world! <3');
}

// get single
// get multiple (spelniajace warunek, tu bedzie pewnie pare warunkow)
// ogolnie pewnie wszystkie z funkcji co sa w bazie, co