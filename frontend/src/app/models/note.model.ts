export class Note{
  name!: string;
  author_id!: number;
  category_id!: number;
  subcategory_id!: number;
  adress!: string;
  description?: string;
  shared_date?: Date;
  last_edit_date?: Date;
  published?: boolean;
  positive_reviews?: number;
  negative_reviews?: number;
}
