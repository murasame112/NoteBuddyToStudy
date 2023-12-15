import { ObjectId } from "bson";
export class Card {
  questions: Array<string>;
  answers: Array<string>;
  note_id: ObjectId;
  author_id: ObjectId;
  published?: boolean;
  shared_date?: Date;
  last_edit_date?: Date;

  constructor(
    questions: Array<string>,
    answers: Array<string>,
    note_id: ObjectId,
    author_id: ObjectId,
    published?: boolean,
    shared_date?: Date,
    last_edit_date?: Date
  ) {
    this.questions = questions;
    this.answers = answers;
    this.note_id = note_id;
    this.author_id = author_id;
    this.published = published ? published : false;
    this.shared_date = shared_date ? shared_date : new Date();
    this.last_edit_date = last_edit_date ? last_edit_date : this.shared_date;
  }
}
