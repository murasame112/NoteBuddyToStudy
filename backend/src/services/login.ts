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

export async function checkIfUserExists(userEmail: string){
	const result = await global.getItemsByField({"email": userEmail}, 'users');
	let check = false;
	if(result.length > 0){
		check = true;
	}
	return check;
}

export function hashPassword(password: string){
	return passwordHash.generate(password, {"algorithm": "sha1", "saltLength":8, "iterations":1});
}

export function verifyPassword(password: string, hash: string){
	return passwordHash.verify(password, hash)
}

export async function login(login: string, password: string) {
	const result = await global.getAllItems('users');
	if(typeof result == 'undefined'){
		return false;
	}
	let user: User | undefined;
	//TODO: ponizszy foreach zmienic na find
	result.forEach(function (element){
				if(element.login == login){
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
	
	const configJson =  JSON.parse(fs.readFileSync( path.resolve(__dirname, '../config.json'), 'utf8'));
	const secret = configJson.secret;
	const createdPayload = {
		"login": login,
		"password": password
	}
	let token = jwt.sign(createdPayload, secret);
	return token;
}


export function checkIfLogged(token: string){
	const configJson =  JSON.parse(fs.readFileSync( path.resolve(__dirname, '../config.json'), 'utf8'));
	const secret = configJson.secret;
	try{
		const payload = jwt.verify(token, secret);
		return payload;
	}catch (error){
		return false;
	}
}