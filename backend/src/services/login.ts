import { Console } from "console";
import { ObjectId } from "bson";
import express from "express";
import e, { Request, Response } from "express";
import * as global from "../global_database_functions";
import * as globalTools from "../global_tools";
import jwt from 'jsonwebtoken';
import passwordHash from 'password-hash';

/* TODO:
2 - funkcja do rejestracji (a raczej przerobić insertUser tak, żeby używało hashowania i wcześniej sprawdzało czy użytkownik istnieje)
3 - funkcja do logowania (hashowanie hasla, porownywanie z baza, tworzenie tokenu lub zwracanie info ze blad)
4 - funkcja do wylogowywania
5 - edycja endpointow zeby przyjmowaly token (czy to powinno byc na backu?)
6 - czasowe tokeny
7 - poprawa funkcji checkIfUserExists (powinno byc inne zapytanie do bazy niz get all users, bardziej cos jak sql'owe "like")
8 - udokumentować wszystko

*/
function checkIfUserExists(userEmail: string){
	const result = global.getAllItems('users');
	let check = false;
  result.then((value) => {
    value.forEach(function (element){
			if(element.email == userEmail){
				check = true;
			}
		});
  });

	return check;
}

export function hashPassword(password: string){
	return passwordHash.generate(password);
}

export function verifyPassword(password: string, hash: string){
	return passwordHash.verify(password, hash)
}

export function login(req: Request, res: Response) {
   


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
