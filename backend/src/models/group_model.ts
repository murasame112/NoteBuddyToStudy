import { ObjectId } from "bson";
import { Type } from "../enums/group_type_enum";
export class Group {
  type: Type;
  users: Array<ObjectId>;
	created: Date;

  constructor(type: Type, users?: Array<ObjectId>, created?: Date) {
    this.type = type;
    this.users = users ? users : [];
		this.created = created ? created : new Date();
  }
}
