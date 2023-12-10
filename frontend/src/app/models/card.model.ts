export interface Card {
  _id?: string;
  questions: Array<string>;
  answers: Array<string>;
  note_id: string;
  author_id: string;
  published: boolean;
  shared_date?: Date;
  last_edit_date?: Date;
}
