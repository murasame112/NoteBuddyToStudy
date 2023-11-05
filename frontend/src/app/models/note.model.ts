import { ObjectId } from 'bson';


export class Note{
  _id?:Object;
  name!: string;
  author_id!: Object;
  category_id!: Object;
  subcategory_id!: Object;
  // adress!: string;
  content?: string;
  shared_date?: Date;
  last_edit_date?: Date;
  published?: boolean;
  positive_reviews?: number;
  negative_reviews?: number;
}

// export class Note{
//   _id?:ObjectId;
//   name!: string;
//   author_id!: ObjectId;
//   category_id!: ObjectId;
//   subcategory_id!: ObjectId;
//   adress!: string;
//   description?: string;
//   shared_date?: Date;
//   last_edit_date?: Date;
//   published?: boolean;
//   positive_reviews?: number;
//   negative_reviews?: number;
// }
