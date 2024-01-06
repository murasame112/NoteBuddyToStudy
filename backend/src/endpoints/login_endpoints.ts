import { Console } from "console";
import { ObjectId } from "bson";
import express from "express";
import e, { Request, Response } from "express";
import { User } from "../models/user_model";
import * as global from "../global_database_functions";
import { Role } from "../enums/role_enum";
import * as loginService from "../services/login";
import * as globalTools from "../global_tools";
import { JwtPayload } from "jsonwebtoken";
import fs from 'fs';
import path from 'path';


// logs user in. returns token if successful, otherwise false
// /login
// example body:
//   {
    //  "login":"custom login",
    //  "password":"custom password",
// }
// example:
//  http://localhost:3000/login
export function loginUser(req: Request, res: Response) {
  const result = loginService.login(req.body.login, req.body.password);
	result.then((value) => {
    res.send(value);
  });
}

// extracts user from token. returns user if successful, otherwise false
// /extract
// example:
//  http://localhost:3000/extract
export function extractUser(req: Request, res: Response) {
	const authData = req.headers.authorization;
	const token = authData?.split(' ')[1] ?? '';
	const payload = loginService.checkIfLogged(token);
	if(payload == false){
		res.status(401).send("Error - unauthorized");
		return false;
	}else{
		let login = payload as JwtPayload;
		login = login.login;
		const query = { ["login"]: login };
  	const users = global.getItemsByField(query, "users");
		users.then((value) => {
			const user: User = value[0]; 
			res.send(user);
		});
	}
}

// registers and/or logs google user in
// /logingoogle
// headers:
//  Content-Type: application/json
// example:
//  http://localhost:3000/logingoogle
// example body:
//   {
//      "login":"custom login",
//      "email":"custom email",
// 			"role":"user"
// }
export function loginGoogle(req: Request, res: Response) {

	const configJson =  JSON.parse(fs.readFileSync( path.resolve(__dirname, '../config.json'), 'utf8'));
	const avatar = configJson.default_avatar;
	loginService.checkIfUserExists(req.body.email).then((value) => {
		if(value == true){
			const lresult = loginService.login(req.body.login, "null");
			lresult.then((val) => {
    		res.send(val);
  		});
		}

		let login = req.body.login;
		const cresult = global.getItemsByField({"login": login}, 'users');
		cresult.then((value) => {
			if(value.length > 0 ){
				login = login + value.length + "";					
			}
			const user: User = new User(
				login,
				avatar,
				req.body.email,
				loginService.hashPassword("null"),
				req.body.role,
				true
			);
			const iresult = global.insertItem(user, 'users');
			iresult.then((value) => {
				if(value.acknowledged){
					const lresult = loginService.login(user.login, user.password);
					lresult.then((val) => {
						res.send(val);
					});
				}
			});
		});
	});
}