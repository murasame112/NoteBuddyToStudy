import { ObjectId } from "bson";
export class Hint {
  content: string;
	_id?: ObjectId;

  constructor(content: string, _id?: ObjectId) {
    this.content = content;
		this._id = _id ? _id : undefined;
  }
}
