import { ObjectId } from "bson";
import { Type } from "../enums/group_type_enum";
export class Group {
  type: Type;
  users: Array<ObjectId>;
	created: Date;
	_id?: ObjectId;

  constructor(type: Type, users?: Array<ObjectId>, created?: Date, _id?: ObjectId) {
    this.type = type;
    this.users = users ? users : [];
		this.created = created ? created : new Date();
		this._id = _id ? _id : undefined;
  }
}
