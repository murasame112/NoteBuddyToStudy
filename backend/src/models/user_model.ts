import { ObjectId } from "bson";
import { Notification } from "./notification_model";
import { Role } from "../enums/role_enum";
export class User {
  name: string;
  avatar_url: string;
  login: string; // mail
  password: string;
  active: boolean; // false means banned
  created: Date;
  role: Role;
  untrusted: boolean;
  saved_notes: Array<ObjectId>;
  followed_users: Array<ObjectId>;
  blocked_users: Array<ObjectId>;
  notifications: Array<Notification>;

  constructor(
    name: string,
    avatar_url: string,
    login: string,
    password: string,
    active: boolean,
    role?: Role,
    untrusted?: boolean,
    saved_notes?: Array<ObjectId>,
    followed_users?: Array<ObjectId>,
    blocked_users?: Array<ObjectId>,
    notifications?: Array<Notification>
  ) {
    this.name = name;
    this.avatar_url = avatar_url;
    this.login = login;
    this.password = password;
    this.active = active;
    this.created = new Date();
    this.role = role ? role : Role.user;
    this.untrusted = false;
    this.saved_notes = [];
    this.followed_users = [];
    this.blocked_users = [];
    this.notifications = [];
  }
}
