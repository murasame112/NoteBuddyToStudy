import express from 'express';
import { Console } from 'console';
import { Request, Response } from 'express';
import { ObjectId } from 'bson';
import * as noteEndpoints from "./endpoints/note_endpoints";

const app = express() ;
app.use(express.json());
const cors= require('cors');


// ============== NOTE ENDPOINTS ==============

app.get('/note/:id', noteEndpoints.getNoteById);
app.get('/stealnote/:id', noteEndpoints.stealNote);
app.get('/notes', noteEndpoints.getAllNotes);
app.get('/notes/:field&:value', noteEndpoints.getNotesByQuery);
app.post('/note', noteEndpoints.insertNote);
app.post('/notes', noteEndpoints.insertMultipleNotes);
app.delete('/note/:id', noteEndpoints.deleteNote);
app.delete('/notes', noteEndpoints.deleteMultipleNotes);
app.delete('/notes/:field&:value', noteEndpoints.deleteNotesByQuery);
app.patch('/note/:id',  noteEndpoints.updateNote);
app.patch('/notes/:field&:value',  noteEndpoints.updateNotesByQuery);
app.patch('/notes',  noteEndpoints.updateMultipleNotes);
app.put('/note/:id',  noteEndpoints.replaceNote);





//===============================CORS===============================

app.use(
  cors({
    origin:"http://localhost:4200",

  }) 
)



    // =============== ponizej notatki, do usuniecia potem ==============
//app.get('/', function (req, res) { 
    
    





    // const note = global.getItemById(2, 'notes');
    // note.then((value) => {
    //     console.log(value);
    //     res.send(value);
    //   });
    
    
    // let x = {
    //   "_category_id":2,
    //   "_name":"Pozytywizm"
    // }
    //   let y = global.insertItem(x, 'subcategories');
    // y.then((value) => {
    //   console.log(value);
    // });

    // global.deleteItemById('6489cd7a10bbfd842e98a8c1', 'subcategories');

    //global.deleteItemsByField({_name: "Pozytywizm"}, 'subcategories');

    //global.getItemsByField({_name: "Pozytywizm"}, 'subcategories');

    //global.updateItemById('6489d245bc3fef6296995f17', 'subcategories', {_name: "Antyk"});

   // global.updateItemsByField({_name: "Pozytywizm"}, 'subcategories', {_name: "Antyk"});
    
    // let replacement = {
    // _id: new ObjectId('6489dd484e5441e722db9aac'),
    //     '_category_id':2,
    //     '_name':'Pozytywizm'
    // }
    // global.replaceItemById('6489dd484e5441e722db9aac', 'subcategories', replacement);

    //global.stealItemById('648a3968510e8ee61572e748', 'subcategories');

   // res.send('hello world');
    

//});

app.listen(3000);
