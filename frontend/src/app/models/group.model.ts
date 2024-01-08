export interface Group {
  _id?: string;
  type: 'two' | 'multiple';
  users: Array<string>;
  subcategory_id: string;
  created?: Date;
}
