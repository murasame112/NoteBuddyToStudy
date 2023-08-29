import { ObjectId } from "bson";

export function createDateString(date?: Date){
	if(typeof date !== 'undefined'){
		return new Date(date).toLocaleString("en-GB");
	}else{
		return new Date().toLocaleString("en-GB");
	}
}

export function createDate(str?: Date){
	if(typeof str !== 'undefined'){
		// przerobić str
		//return new Date(str);
	}else{
		//return new Date();
	}
}
