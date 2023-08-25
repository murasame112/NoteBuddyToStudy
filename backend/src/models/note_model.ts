import { ObjectId } from "bson";
export class Note {
  name: string;
  author_id: ObjectId;
  category_id: ObjectId;
  subcategory_id: ObjectId;
  adress: string;
  description?: string;
  shared_date?: Date;
  last_edit_date?: Date;
  published?: boolean;
  positive_reviews?: number;
  negative_reviews?: number;

  constructor(
    name: string,
    author_id: ObjectId,
    category_id: ObjectId,
    subcategory_id: ObjectId,
    adress: string,
    description?: string,
    shared_date?: Date,
    last_edit_date?: Date,
    published?: boolean,
    positive_reviews?: number,
    negative_reviews?: number
  ) {
    this.name = name;
    this.author_id = author_id;
    this.category_id = category_id;
    this.subcategory_id = subcategory_id;
    this.adress = adress;
    this.description = description ? description : "";
    this.shared_date = shared_date ? shared_date : new Date();
    this.last_edit_date = last_edit_date ? last_edit_date : this.shared_date;
    this.published = published ? published : false;
    this.positive_reviews = positive_reviews ? positive_reviews : 0;
    this.negative_reviews = negative_reviews ? negative_reviews : 0;
  }
}
