import express from 'express';
import { Console } from 'console';
import { Request, Response } from 'express';
import { ObjectId } from 'bson';
import { getItemById, getItemsByField, insertItem, deleteItemById, deleteItemsByField, updateItemById, updateItemsByField, replaceItemById } from './global_functions';
//import * as global from './global_functions';

const app = express() 
app.use(express.json())
app.get('/', function (req, res) { 
    
    
    // const note = getItemById(2, 'notes');
    // note.then((value) => {
    //     console.log(value);
    //     res.send(value);
    //   });
    
    
    //   let x = {
    //   "_category_id":2,
    //   "_name":"Pozytywizm"
    // }
    //   let y = insertItem(x, 'subcategories');
    // y.then((value) => {
    //   console.log(value);
    // });

    // deleteItemById('6489cd7a10bbfd842e98a8c1', 'subcategories');

    //deleteItemsByField({_name: "Pozytywizm"}, 'subcategories');

    //getItemsByField({_name: "Pozytywizm"}, 'subcategories');

    //updateItemById('6489d245bc3fef6296995f17', 'subcategories', {_name: "Antyk"});

   // updateItemsByField({_name: "Pozytywizm"}, 'subcategories', {_name: "Antyk"});
    
    // let replacement = {
    // _id: new ObjectId('6489dd484e5441e722db9aac'),
    //     '_category_id':2,
    //     '_name':'Pozytywizm'
    // }
    //replaceItemById('6489dd484e5441e722db9aac', 'subcategories', replacement);

    
    res.send('hello world');
    

});

app.listen(3000);
