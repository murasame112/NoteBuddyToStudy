export interface UserRateNote {
  _id?: string;
  rate: 'positive' | 'negative';
  note_id: string;
  user_id?: string;
}
