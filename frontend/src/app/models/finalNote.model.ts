export interface FinalNote {
  //Note
  note_id: string;
  noteName: string;
  content: string;
  shared_date: Date;
  last_edit_date: Date;
  published: boolean;
  positive_reviews: number;
  negative_reviews: number;

  //category
  category_id: string;
  categoryName: string;

  //subcategory
  subcategory_id: string;
  subcategoryName: string;

  //user
  author_id: string;
  login: string;
  avatar_url: string;
  email: string;
  password: string;
  active: boolean;
  created: Date;
  role: string;
  untrusted: boolean;
  saved_notes: Array<string>;
  followed_users: Array<string>;
  blocked_users: Array<string>;
}
