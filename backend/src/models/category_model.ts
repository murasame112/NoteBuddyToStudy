import { ObjectId } from "bson";
export class Category {
	_id?: ObjectId | string;
  name: string;

  constructor(name: string, _id?: ObjectId) {
    this.name = name;
		this._id = _id ? _id : "";
  }
}
