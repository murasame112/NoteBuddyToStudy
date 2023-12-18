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

