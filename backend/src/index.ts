import express from 'express';
import { Console } from 'console';
import { Request, Response } from 'express';
 import { getItemById, insertItem } from './global_functions';

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
      // let y = insertItem(x, 'subcategories');
    // y.then((value) => {
    //   console.log(value);
    // });
    
    res.send('hello world');
    
     
}) ;

app.listen(3000);
