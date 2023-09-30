import { ObjectId } from "bson";
import { Notification } from "./notification_model";
import { Role } from "../enums/role_enum";
export class User {
  login: string;
  avatar_url: string;
  email: string;
  password: string;
  active: boolean; // false means banned
  role: Role;
  untrusted: boolean;
  saved_notes: Array<ObjectId>;
  followed_users: Array<ObjectId>;
  blocked_users: Array<ObjectId>;
	created: Date;

  constructor(
    login: string,
    avatar_url: string,
    email: string,
    password: string,
    active: boolean,
    role?: Role,
    untrusted?: boolean,
    saved_notes?: Array<ObjectId>,
    followed_users?: Array<ObjectId>,
    blocked_users?: Array<ObjectId>,
		created?: Date,
  ) {
    this.login = login;
    this.avatar_url = avatar_url;
    this.email = email;
    this.password = password;
    this.active = active;
    this.role = role ? role : Role.user;
    this.untrusted = false;
    this.saved_notes = [];
    this.followed_users = [];
    this.blocked_users = [];
		this.created = created ? created : new Date();
  }
}
