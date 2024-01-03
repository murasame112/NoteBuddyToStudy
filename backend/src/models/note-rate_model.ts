import { ObjectId } from "bson";
import { Rate } from "../enums/rate_enum";
export class NoteRate {
  rate: Rate;
  note_id: ObjectId;

  constructor(rate: Rate, note_id: ObjectId) {
    this.rate = rate;
    this.note_id = note_id;
  }
}
