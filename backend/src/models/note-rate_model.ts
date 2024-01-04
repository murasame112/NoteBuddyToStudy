import { ObjectId } from "bson";
import { Rate } from "../enums/rate_enum";
export class NoteRate {
  rate: Rate;
  note_id: ObjectId;
	user_id: ObjectId;
	_id?: ObjectId;

  constructor(rate: Rate, note_id: ObjectId, user_id: ObjectId, _id?: ObjectId) {
    this.rate = rate;
    this.note_id = note_id;
		this.user_id = user_id;
		this._id = _id ? _id : undefined;
  }
}
