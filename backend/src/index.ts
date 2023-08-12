import express from 'express';
import { Console } from 'console';
import { Request, Response } from 'express';
import { ObjectId } from 'bson';
import * as noteEndpoints from "./endpoints/note_endpoints";
import * as userEndpoints from "./endpoints/user_endpoints";
import * as categoryEndpoints from "./endpoints/category_endpoints";
import * as subcategoryEndpoints from "./endpoints/subcategory_endpoints";
import * as notificationEndpoints from "./endpoints/notification_endpoints";
import * as cardEndpoints from "./endpoints/card_endpoints";

const app = express() ;
app.use(express.json());

//===============================CORS===============================

const cors= require('cors');
app.use(cors())

// app.use(
//   cors({
//     origin:"http://localhost:4200",

//   }) 
// )




// ============== NOTE ENDPOINTS ==============

app.get('/note/:id', noteEndpoints.getNoteById);
app.get('/stealnote/:id', noteEndpoints.stealNote);
app.get('/notes', noteEndpoints.getAllNotes);
app.get('/notes/:field&:value', noteEndpoints.getNotesByQuery);
app.get('/notesid/:field&:value', noteEndpoints.getNotesByQueriedId);
app.post('/note', noteEndpoints.insertNote);
app.post('/notes', noteEndpoints.insertMultipleNotes);
app.delete('/note/:id', noteEndpoints.deleteNote);
app.delete('/notes', noteEndpoints.deleteMultipleNotes);
app.delete('/notes/:field&:value', noteEndpoints.deleteNotesByQuery);
app.patch('/note/:id',  noteEndpoints.updateNote);
app.patch('/notes/:field&:value',  noteEndpoints.updateNotesByQuery);
app.patch('/notes',  noteEndpoints.updateMultipleNotes);
app.put('/note/:id',  noteEndpoints.replaceNote);

// ============== USER ENDPOINTS ==============

app.get('/user/:id', userEndpoints.getUserById);
app.get('/stealuser/:id', userEndpoints.stealUser);
app.get('/users', userEndpoints.getAllUsers);
app.get('/users/:field&:value', userEndpoints.getUsersByQuery);
app.get('/usersid/:field&:value', userEndpoints.getUsersByQueriedId);
app.post('/user', userEndpoints.insertUser);
app.post('/users', userEndpoints.insertMultipleUsers);
app.delete('/user/:id', userEndpoints.deleteUser);
app.delete('/users', userEndpoints.deleteMultipleUsers);
app.delete('/users/:field&:value', userEndpoints.deleteUsersByQuery);
app.patch('/user/:id',  userEndpoints.updateUser);
app.patch('/users/:field&:value',  userEndpoints.updateUsersByQuery);
app.patch('/users',  userEndpoints.updateMultipleUsers);
app.put('/user/:id',  userEndpoints.replaceUser);

// ============== CATEGORY ENDPOINTS ==============

app.get('/category/:id', categoryEndpoints.getCategoryById);
app.get('/stealcategory/:id', categoryEndpoints.stealCategory);
app.get('/categories', categoryEndpoints.getAllCategories);
app.get('/categories/:field&:value', categoryEndpoints.getCategoriesByQuery);
app.post('/category', categoryEndpoints.insertCategory);
app.post('/categories', categoryEndpoints.insertMultipleCategories);
app.delete('/category/:id', categoryEndpoints.deleteCategory);
app.delete('/categories', categoryEndpoints.deleteMultipleCategories);
app.delete('/categories/:field&:value', categoryEndpoints.deleteCategoriesByQuery);
app.patch('/category/:id',  categoryEndpoints.updateCategory);
app.patch('/categories/:field&:value',  categoryEndpoints.updateCategoriesByQuery);
app.patch('/categories',  categoryEndpoints.updateMultipleCategories);
app.put('/category/:id',  categoryEndpoints.replaceCategory);

// ============== SUBCATEGORY ENDPOINTS ==============

app.get('/subcategory/:id', subcategoryEndpoints.getSubcategoryById);
app.get('/stealsubcategory/:id', subcategoryEndpoints.stealSubcategory);
app.get('/subcategories', subcategoryEndpoints.getAllSubcategories);
app.get('/subcategories/:field&:value', subcategoryEndpoints.getSubcategoriesByQuery);
app.get('/subcategoriesid/:field&:value', subcategoryEndpoints.getSubcategoriesByQueriedId);
app.post('/subcategory', subcategoryEndpoints.insertSubcategory);
app.post('/subcategories', subcategoryEndpoints.insertMultipleSubcategories);
app.delete('/subcategory/:id', subcategoryEndpoints.deleteSubcategory);
app.delete('/subcategories', subcategoryEndpoints.deleteMultipleSubcategories);
app.delete('/subcategories/:field&:value', subcategoryEndpoints.deleteSubcategoriesByQuery);
app.patch('/subcategory/:id',  subcategoryEndpoints.updateSubcategory);
app.patch('/subcategories/:field&:value',  subcategoryEndpoints.updateSubcategoriesByQuery);
app.patch('/subcategories',  subcategoryEndpoints.updateMultipleSubcategories);
app.put('/subcategory/:id',  subcategoryEndpoints.replaceSubcategory);

// ============== NOTIFICATION ENDPOINTS ==============

app.get('/notification/:id', notificationEndpoints.getNotificationById);
app.get('/stealnotification/:id', notificationEndpoints.stealNotification);
app.get('/notifications', notificationEndpoints.getAllNotifications);
app.get('/notifications/:field&:value', notificationEndpoints.getNotificationsByQuery);
app.post('/notification', notificationEndpoints.insertNotification);
app.post('/notifications', notificationEndpoints.insertMultipleNotifications);
app.delete('/notification/:id', notificationEndpoints.deleteNotification);
app.delete('/notifications', notificationEndpoints.deleteMultipleNotifications);
app.delete('/notifications/:field&:value', notificationEndpoints.deleteNotificationsByQuery);
app.patch('/notification/:id',  notificationEndpoints.updateNotification);
app.patch('/notifications/:field&:value',  notificationEndpoints.updateNotificationsByQuery);
app.patch('/notifications',  notificationEndpoints.updateMultipleNotifications);
app.put('/notification/:id',  notificationEndpoints.replaceNotification);

// ============== CARD ENDPOINTS ==============

app.get('/card/:id', cardEndpoints.getCardById);
app.get('/stealcard/:id', cardEndpoints.stealCard);
app.get('/cards', cardEndpoints.getAllCards);
app.get('/cards/:field&:value', cardEndpoints.getCardsByQuery);
app.get('/cardsid/:field&:value', cardEndpoints.getCardsByQueriedId);
app.post('/card', cardEndpoints.insertCard);
app.post('/cards', cardEndpoints.insertMultipleCards);
app.delete('/card/:id', cardEndpoints.deleteCard);
app.delete('/cards', cardEndpoints.deleteMultipleCards);
app.delete('/cards/:field&:value', cardEndpoints.deleteCardsByQuery);
app.patch('/card/:id',  cardEndpoints.updateCard);
app.patch('/cards/:field&:value',  cardEndpoints.updateCardsByQuery);
app.patch('/cards',  cardEndpoints.updateMultipleCards);
app.put('/card/:id',  cardEndpoints.replaceCard);





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
