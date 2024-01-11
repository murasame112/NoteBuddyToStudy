import { ObjectId } from "bson";
import { Type } from "../enums/group_type_enum";
import { Message } from "./message_model";
export class Group {
  type: Type;
  users: Array<ObjectId>;
	subcategory_id: ObjectId;
	messages?: Array<Message>;
	created?: Date;
	_id?: ObjectId;

  constructor(type: Type, users: Array<ObjectId>, subcategory_id: ObjectId, messages?: Array<Message>, created?: Date, _id?: ObjectId) {
    this.type = type;
    this.users = users ? users : [];
		this.subcategory_id = subcategory_id;
		this.messages = messages ? messages : [];
		this.created = created ? created : new Date();
		this._id = _id ? _id : undefined;
  }
}
