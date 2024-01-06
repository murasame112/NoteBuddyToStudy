import { ObjectId } from "bson";
import { NoteRate } from "./note-rate_model";
import { Role } from "../enums/role_enum";
export class User {
  login: string;
  avatar_url: string;
  email: string;
  password: string | null;
	role: Role;
	is_google: boolean;
  active: boolean; // false means banned
  untrusted: boolean;
  saved_notes: Array<ObjectId>;
  followed_users: Array<ObjectId>;
  blocked_users: Array<ObjectId>;
	created: Date;
	_id?: ObjectId;

  constructor(
    login: string,
    avatar_url: string,
    email: string,
    password: string | null,
		role?: Role,
		is_google?: boolean,
    active?: boolean,
    untrusted?: boolean,
    saved_notes?: Array<ObjectId>,
    followed_users?: Array<ObjectId>,
    blocked_users?: Array<ObjectId>,
		created?: Date,
		_id?: ObjectId
  ) {
    this.login = login;
    this.avatar_url = avatar_url;
    this.email = email;
    this.password = password;
		this.role = role ? role : Role.user;
		this.is_google = is_google ? is_google : false;
    this.active = active ? active : true;
    this.untrusted = untrusted ? untrusted : true;
    this.saved_notes = saved_notes ? saved_notes : [];
    this.followed_users = followed_users ? followed_users : [];
    this.blocked_users = blocked_users ? blocked_users : [];
		this.created = created ? created : new Date();
		this._id = _id ? _id : undefined;
  }
}
