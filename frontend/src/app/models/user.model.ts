import { UserRateNote } from './userRateNote.model';
export interface User {
  _id?: string;
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
  rated_notes?: Array<UserRateNote>;
  is_google?: boolean;
}

//! name to teraz login
//! to co kiedys bylo loginem teraz jest email
