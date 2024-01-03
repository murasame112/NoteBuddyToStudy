import { ObjectId } from "bson";
export class Subcategory {
  category_id: ObjectId;
  name: string;
	_id?: ObjectId;

  constructor(category_id: ObjectId, name: string, _id?: ObjectId) {
    this.category_id = category_id;
    this.name = name;
		this._id = _id ? _id : undefined;
  }
}
