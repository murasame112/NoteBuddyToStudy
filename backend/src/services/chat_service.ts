import { Console } from "console";
import { ObjectId } from "bson";
import express from "express";
import e, { Request, Response } from "express";
import * as global from "../global_database_functions";
import * as globalTools from "../global_tools";
import jwt from 'jsonwebtoken';
import { JwtPayload } from "jsonwebtoken";
import passwordHash from 'password-hash';
import { User } from "../models/user_model";
import fs from 'fs';
import path from 'path';

export async function computeUserIdFromHeaders(socket: string){
	const configJson =  JSON.parse(fs.readFileSync( path.resolve(__dirname, '../config.json'), 'utf8'));
	const secret = configJson.secret;
	
	const payload = jwt.verify(socket, secret);
	let login = payload as JwtPayload;
	login = login.login;
	
	const query = { ["login"]: login };
	const users = global.getItemsByField(query, "users");
	users.then((value) => {
		const user: User = value[0]; 
		console.log("tuz przed returnem");
		return user;
	});
}

