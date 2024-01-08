export interface Card {
  _id?: string;
  question: string;
  answer: string;
  note_id: string;
  author_id: string;
  published?: boolean;
  shared_date?: Date;
  last_edit_date?: Date;
}
