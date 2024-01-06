import express from "express";
import { Console } from "console";
import { Request, Response } from "express";
import { ObjectId } from "bson";

import * as noteEndpoints from "./endpoints/note_endpoints";
import * as userEndpoints from "./endpoints/user_endpoints";
import * as noterateEndpoints from "./endpoints/note-rate_endpoints";
import * as loginEndpoints from "./endpoints/login_endpoints";
import * as categoryEndpoints from "./endpoints/category_endpoints";
import * as subcategoryEndpoints from "./endpoints/subcategory_endpoints";
import * as notificationEndpoints from "./endpoints/notification_endpoints";
import * as metanotificationEndpoints from "./endpoints/meta-notification_endpoints";
import * as cardEndpoints from "./endpoints/card_endpoints";
import * as groupEndpoints from "./endpoints/group_endpoints";
import * as hintEndpoints from "./endpoints/hint_endpoints";
import * as logEndpoints from "./endpoints/log_endpoints";


const app = express();
app.use(express.json({ limit: '100mb' }));
//===============================CORS===============================

const cors = require("cors");
app.use(cors());

// app.use(
//   cors({
//     origin:"http://localhost:4200",

//   })
// )

// ============== NOTE ENDPOINTS ==============

app.get("/note/:id", noteEndpoints.getNoteById);
app.get("/stealnote/:id", noteEndpoints.stealNote);
app.get("/notes", noteEndpoints.getAllNotes);
app.get("/notes/:field&:value", noteEndpoints.getNotesByQuery);
app.get("/notesid/:field&:value", noteEndpoints.getNotesByQueriedId);
app.post("/note", noteEndpoints.insertNote);
app.post("/notes", noteEndpoints.insertMultipleNotes);
app.delete("/note/:id", noteEndpoints.deleteNote);
app.delete("/notes", noteEndpoints.deleteMultipleNotes);
app.delete("/notes/:field&:value", noteEndpoints.deleteNotesByQuery);
app.delete("/notesid/:field&:value", noteEndpoints.deleteNotesByQueriedId);
app.patch("/note/:id", noteEndpoints.updateNote);
app.patch("/notes/:field&:value", noteEndpoints.updateNotesByQuery);
app.patch("/notes", noteEndpoints.updateMultipleNotes);
app.patch("/notesid/:field&:value", noteEndpoints.updateNotesByQueriedId);
app.put("/note/:id", noteEndpoints.replaceNote);
app.put("/ratenote/:id", noteEndpoints.rateNote);


// ============== USER ENDPOINTS ==============

app.get("/user/:id", userEndpoints.getUserById);
app.get("/stealuser/:id", userEndpoints.stealUser);
app.get("/users", userEndpoints.getAllUsers);
app.get("/users/:field&:value", userEndpoints.getUsersByQuery);
app.get("/usersid/:field&:value", userEndpoints.getUsersByQueriedId);
app.post("/user",  userEndpoints.insertUser);
app.post("/users", userEndpoints.insertMultipleUsers);
app.delete("/user/:id", userEndpoints.deleteUser);
app.delete("/users", userEndpoints.deleteMultipleUsers);
app.delete("/users/:field&:value", userEndpoints.deleteUsersByQuery);
app.delete("/usersid/:field&:value", userEndpoints.deleteUsersByQueriedId);
app.patch("/user/:id", userEndpoints.updateUser);
app.patch("/users/:field&:value", userEndpoints.updateUsersByQuery);
app.patch("/users", userEndpoints.updateMultipleUsers);
app.patch("/usersid/:field&:value", userEndpoints.updateUsersByQueriedId);
app.put("/user/:id", userEndpoints.replaceUser);

// ============== NOTE-RATE ENDPOINTS ==============

app.get("/noterate/:id", noterateEndpoints.getNoteRateById);
app.get("/stealnoterate/:id", noterateEndpoints.stealNoteRate);
app.get("/noterates", noterateEndpoints.getAllNoteRates);
app.get("/noterates/:field&:value", noterateEndpoints.getNoteRatesByQuery);
app.get("/noteratesid/:field&:value",noterateEndpoints.getNoteRatesByQueriedId);
app.post("/noterate", noterateEndpoints.insertNoteRate);
app.post("/noterates", noterateEndpoints.insertMultipleNoteRates);
app.delete("/noterate/:id", noterateEndpoints.deleteNoteRate);
app.delete("/noterates", noterateEndpoints.deleteMultipleNoteRates);
app.delete("/noterates/:field&:value", noterateEndpoints.deleteNoteRatesByQuery);
app.delete("/noteratesid/:field&:value", noterateEndpoints.deleteNoteRatesByQueriedId);
app.patch("/noterate/:id", noterateEndpoints.updateNoteRate);
app.patch("/noterates/:field&:value", noterateEndpoints.updateNoteRatesByQuery);
app.patch("/noterates", noterateEndpoints.updateMultipleNoteRates);
app.patch("/noteratesid/:field&:value", noterateEndpoints.updateNoteRatesByQueriedId);
app.put("/noterate/:id", noterateEndpoints.replaceNoteRate);

// ============== LOGIN ENDPOINTS ==============

app.post("/login", loginEndpoints.loginUser);
app.post("/logingoogle", loginEndpoints.loginGoogle);
app.get("/extract", loginEndpoints.extractUser);

// ============== CATEGORY ENDPOINTS ==============

app.get("/category/:id", categoryEndpoints.getCategoryById);
app.get("/stealcategory/:id", categoryEndpoints.stealCategory);
app.get("/categories", categoryEndpoints.getAllCategories);
app.get("/categories/:field&:value", categoryEndpoints.getCategoriesByQuery);
app.post("/category", categoryEndpoints.insertCategory);
app.post("/categories", categoryEndpoints.insertMultipleCategories);
app.delete("/category/:id", categoryEndpoints.deleteCategory);
app.delete("/categories", categoryEndpoints.deleteMultipleCategories);
app.delete("/categories/:field&:value",categoryEndpoints.deleteCategoriesByQuery);
app.patch("/category/:id", categoryEndpoints.updateCategory);
app.patch("/categories/:field&:value",categoryEndpoints.updateCategoriesByQuery);
app.patch("/categories", categoryEndpoints.updateMultipleCategories);
app.put("/category/:id", categoryEndpoints.replaceCategory);

// ============== SUBCATEGORY ENDPOINTS ==============

app.get("/subcategory/:id", subcategoryEndpoints.getSubcategoryById);
app.get("/stealsubcategory/:id", subcategoryEndpoints.stealSubcategory);
app.get("/subcategories", subcategoryEndpoints.getAllSubcategories);
app.get("/subcategories/:field&:value", subcategoryEndpoints.getSubcategoriesByQuery);
app.get("/subcategoriesid/:field&:value",subcategoryEndpoints.getSubcategoriesByQueriedId);
app.post("/subcategory", subcategoryEndpoints.insertSubcategory);
app.post("/subcategories", subcategoryEndpoints.insertMultipleSubcategories);
app.delete("/subcategory/:id", subcategoryEndpoints.deleteSubcategory);
app.delete("/subcategories", subcategoryEndpoints.deleteMultipleSubcategories);
app.delete("/subcategories/:field&:value", subcategoryEndpoints.deleteSubcategoriesByQuery);
app.delete("/subcategoriesid/:field&:value", subcategoryEndpoints.deleteSubcategoriesByQueriedId);
app.patch("/subcategory/:id", subcategoryEndpoints.updateSubcategory);
app.patch("/subcategories/:field&:value", subcategoryEndpoints.updateSubcategoriesByQuery);
app.patch("/subcategories", subcategoryEndpoints.updateMultipleSubcategories);
app.patch("/subcategoriesid/:field&:value", subcategoryEndpoints.updateSubcategoriesByQueriedId);
app.put("/subcategory/:id", subcategoryEndpoints.replaceSubcategory);

// ============== NOTIFICATION ENDPOINTS ==============

app.get("/notification/:id", notificationEndpoints.getNotificationById);
app.get("/stealnotification/:id", notificationEndpoints.stealNotification);
app.get("/notifications", notificationEndpoints.getAllNotifications);
app.get("/notifications/:field&:value", notificationEndpoints.getNotificationsByQuery);
app.post("/notification", notificationEndpoints.insertNotification);
app.post("/notifications", notificationEndpoints.insertMultipleNotifications);
app.delete("/notification/:id", notificationEndpoints.deleteNotification);
app.delete("/notifications", notificationEndpoints.deleteMultipleNotifications);
app.delete("/notifications/:field&:value", notificationEndpoints.deleteNotificationsByQuery);
app.patch("/notification/:id", notificationEndpoints.updateNotification);
app.patch("/notifications/:field&:value", notificationEndpoints.updateNotificationsByQuery);
app.patch("/notifications", notificationEndpoints.updateMultipleNotifications);
app.put("/notification/:id", notificationEndpoints.replaceNotification);

// ============== META-NOTIFICATION ENDPOINTS ==============

app.get("/metanotification/:id", metanotificationEndpoints.getMetaNotificationById);
app.get("/stealmetanotification/:id", metanotificationEndpoints.stealMetaNotification);
app.get("/metanotifications", metanotificationEndpoints.getAllMetaNotifications);
app.get("/metanotifications/:field&:value", metanotificationEndpoints.getMetaNotificationsByQuery);
app.get("/metanotificationsid/:field&:value", metanotificationEndpoints.getMetaNotificationsByQueriedId);
app.post("/metanotification", metanotificationEndpoints.insertMetaNotification);
app.post("/metanotifications", metanotificationEndpoints.insertMultipleMetaNotifications);
app.delete("/metanotification/:id", metanotificationEndpoints.deleteMetaNotification);
app.delete("/metanotifications", metanotificationEndpoints.deleteMultipleMetaNotifications);
app.delete("/metanotifications/:field&:value", metanotificationEndpoints.deleteMetaNotificationsByQuery);
app.delete("/metanotificationsid/:field&:value", metanotificationEndpoints.deleteMetaNotificationsByQueriedId);
app.patch("/metanotification/:id", metanotificationEndpoints.updateMetaNotification);
app.patch("/metanotifications/:field&:value", metanotificationEndpoints.updateMetaNotificationsByQuery);
app.patch("/metanotifications", metanotificationEndpoints.updateMultipleMetaNotifications);
app.patch("/metanotificationsid/:field&:value", metanotificationEndpoints.updateMetaNotificationsByQueriedId);
app.put("/metanotification/:id", metanotificationEndpoints.replaceMetaNotification);

// ============== CARD ENDPOINTS ==============

app.get("/card/:id", cardEndpoints.getCardById);
app.get("/stealcard/:id", cardEndpoints.stealCard);
app.get("/cards", cardEndpoints.getAllCards);
app.get("/cards/:field&:value", cardEndpoints.getCardsByQuery);
app.get("/cardsid/:field&:value", cardEndpoints.getCardsByQueriedId);
app.post("/card", cardEndpoints.insertCard);
app.post("/cards", cardEndpoints.insertMultipleCards);
app.delete("/card/:id", cardEndpoints.deleteCard);
app.delete("/cards", cardEndpoints.deleteMultipleCards);
app.delete("/cards/:field&:value", cardEndpoints.deleteCardsByQuery);
app.delete("/cardsid/:field&:value", cardEndpoints.deleteCardsByQueriedId);
app.patch("/card/:id", cardEndpoints.updateCard);
app.patch("/cards/:field&:value", cardEndpoints.updateCardsByQuery);
app.patch("/cards", cardEndpoints.updateMultipleCards);
app.patch("/cardsid/:field&:value", cardEndpoints.updateCardsByQueriedId);
app.put("/card/:id", cardEndpoints.replaceCard);

// ============== GROUP ENDPOINTS ==============

app.get("/group/:id", groupEndpoints.getGroupById);
app.get("/stealgroup/:id", groupEndpoints.stealGroup);
app.get("/groups", groupEndpoints.getAllGroups);
app.get("/groups/:field&:value", groupEndpoints.getGroupsByQuery);
app.get("/groupsid/:field&:value", groupEndpoints.getGroupsByQueriedId);
app.post("/group", groupEndpoints.insertGroup);
app.post("/groups", groupEndpoints.insertMultipleGroups);
app.delete("/group/:id", groupEndpoints.deleteGroup);
app.delete("/groups", groupEndpoints.deleteMultipleGroups);
app.delete("/groups/:field&:value", groupEndpoints.deleteGroupsByQuery);
app.delete("/groupsid/:field&:value", groupEndpoints.deleteGroupsByQueriedId);
app.patch("/group/:id", groupEndpoints.updateGroup);
app.patch("/groups/:field&:value", groupEndpoints.updateGroupsByQuery);
app.patch("/groups", groupEndpoints.updateMultipleGroups);
app.patch("/groupsid/:field&:value", groupEndpoints.updateGroupsByQueriedId);
app.put("/group/:id", groupEndpoints.replaceGroup);
app.patch("/addtogroup", groupEndpoints.addUserToGroup);

// ============== HINT ENDPOINTS ==============

app.get("/hint/:id", hintEndpoints.getHintById);
app.get("/stealhint/:id", hintEndpoints.stealHint);
app.get("/hints", hintEndpoints.getAllHints);
app.get("/hints/:field&:value", hintEndpoints.getHintsByQuery);
app.post("/hint", hintEndpoints.insertHint);
app.post("/hints", hintEndpoints.insertMultipleHints);
app.delete("/hint/:id", hintEndpoints.deleteHint);
app.delete("/hints", hintEndpoints.deleteMultipleHints);
app.delete("/hints/:field&:value", hintEndpoints.deleteHintsByQuery);
app.patch("/hint/:id", hintEndpoints.updateHint);
app.patch("/hints/:field&:value", hintEndpoints.updateHintsByQuery);
app.patch("/hints", hintEndpoints.updateMultipleHints);
app.put("/hint/:id", hintEndpoints.replaceHint);

// ============== LOG ENDPOINTS ==============

app.get("/log/:id", logEndpoints.getLogById);
app.get("/steallog/:id", logEndpoints.stealLog);
app.get("/logs", logEndpoints.getAllLogs);
app.get("/logs/:field&:value", logEndpoints.getLogsByQuery);
app.post("/log", logEndpoints.insertLog);
app.post("/logs", logEndpoints.insertMultipleLogs);
app.delete("/log/:id", logEndpoints.deleteLog);
app.delete("/logs", logEndpoints.deleteMultipleLogs);
app.delete("/logs/:field&:value", logEndpoints.deleteLogsByQuery);
app.patch("/log/:id", logEndpoints.updateLog);
app.patch("/logs/:field&:value", logEndpoints.updateLogsByQuery);
app.patch("/logs", logEndpoints.updateMultipleLogs);
app.put("/log/:id", logEndpoints.replaceLog);

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
