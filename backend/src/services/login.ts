import { Console } from "console";
import { ObjectId } from "bson";
import express from "express";
import e, { Request, Response } from "express";
import * as global from "../global_database_functions";
import * as globalTools from "../global_tools";
import jwt from 'jsonwebtoken';
import passwordHash from 'password-hash';
import { User } from "../models/user_model";
import fs from 'fs';
import path from 'path';

/* TODO:
3 - funkcja do logowania (hashowanie hasla, porownywanie z baza, tworzenie tokenu lub zwracanie info ze blad)
4 - funkcja do wylogowywania
5 - edycja endpointow zeby przyjmowaly token (czy to powinno byc na backu?)
6 - czasowe tokeny
7 - poprawa funkcji checkIfUserExists (powinno byc inne zapytanie do bazy niz get all users, bardziej cos jak sql'owe "like")
8 - udokumentować wszystko
9 - przerobic pozostale InsertUser (multiple etc)?

*/
export async function checkIfUserExists(userEmail: string){
	const result = await global.getAllItems('users');
	let check = false;
	result.forEach(function (element){
				if(element.email == userEmail){
					check = true;
				}
			});
			return check;
  // result.then((value) => {
  //   value.forEach(function (element){
	// 		if(element.email == userEmail){
	// 			check = true;
	// 			return check;
	// 		}
	// 	});		
  // });
	
}

export function hashPassword(password: string){
	return passwordHash.generate(password, {"algorithm": "sha1", "saltLength":8, "iterations":1});
}

export function verifyPassword(password: string, hash: string){
	return passwordHash.verify(password, hash)
}

export async function login(email: string, password: string) {
	//(hashowanie hasla, porownywanie z baza, tworzenie tokenu lub zwracanie info ze blad)

	const result = await global.getAllItems('users');
	let user: User | undefined;
	result.forEach(function (element){
				if(element.email == email){
					user = element; 
				}
			});
	if(user == undefined){
		return false;
	}

	let check = verifyPassword(password, user.password);
	if(check == false){
		return false;
	}

	console.log(path.resolve(__dirname, '../../config.json'));
	const configJson =  JSON.parse(fs.readFileSync( path.resolve(__dirname, '../../config.json'), 'utf8'));
	//const secret = configJson.secret
	console.log(configJson);
	return true;
	// TODO: zwracanie info ze blad, tworzenie tokenu

	// const createdPayload = req.body.email + '.' + pass; 
	// let token = jwt.sign(createdPayload, secret);
	
	// loginService.checkIfUserExists(req.body.email).then((value) => {
	// 	if(value == true){
	// 		res.status(400).send("Error - user already exists");
	// 		return false;
	// 	}


}

// ==========================
// const userEmail: string = req.body.email;
// const userPassword: string = req.body.password;
// let token = "";


// const userExists = checkIfUserExists(userEmail);
// if(userExists){
// 		token = "User with that username already exists."
// }else{
// 	// TODO: Zmiana hasła na hashowane
// 		let secret = "secret";
// 		const createdPayload = userEmail + '.' + userPassword; 
// 		token = jwt.sign(createdPayload, secret);
// 	// to zwraca token i wtedy od razu leci rejestracja (chyba)
		
		
// }

// res.status(201).send(token)

// =====================================

// let secret = "secret";
// const authData = req.headers.authorization
// const token = authData?.split(' ')[1] ?? ''
// const payload = jwt.verify(token, secret);

// ========================================

// export function logut(req: Request, res: Response){
// 	document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
// 	localStorage.removeItem('token')
// 	sessionStorage.removeItem('token')
// 	res.status(201)
// }
