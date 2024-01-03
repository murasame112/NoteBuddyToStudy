import { ObjectId } from "bson";
import { Type } from "../enums/log_type_enum";
export class Log {
  type: Type;
  content: string;
	date: Date;
	_id?: ObjectId;

  constructor(type: Type, content: string, date?: Date,	_id?: ObjectId) {
    this.type = type;
    this.content = content;
    this.date = date ? date : new Date();
		this._id = _id ? _id : undefined;
  }
}
