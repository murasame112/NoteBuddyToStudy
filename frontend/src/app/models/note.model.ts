export class Note{
  name!: string;
  author_id!: Object;
  category_id!: Object;
  subcategory_id!: Object;
  adress!: string;
  description?: string;
  shared_date?: Date;
  last_edit_date?: Date;
  published?: boolean;
  positive_reviews?: number;
  negative_reviews?: number;
}
