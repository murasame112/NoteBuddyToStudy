import express from 'express';
import { Console } from 'console';
import { Request, Response } from 'express';
 import { getItemById } from './global_functions';

const app = express() 
app.use(express.json())
app.get('/', function (req, res) { 
    
    
    const note = getItemById(2, 'notes');
    note.then((value) => {
        console.log(value);
        res.send(value);
      });
    
    
     
}) ;

app.listen(3000);
