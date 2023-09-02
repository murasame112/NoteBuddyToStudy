export class User{
  _id?:string
  name: string
    avatar_url: string
    login: string
    password: string
    active: boolean
    created: Date
    role: string
    untrusted: boolean
    saved_notes: Array<string>
    followed_users: Array<string>
    blocked_users: Array<string>
    notifications: Array<string>

    constructor(
      name: string,
      avatar_url: string,
      login: string,
      password: string,
      active: boolean,
      _id?:string,
      role?: string,
      untrusted?: boolean,
      saved_notes?: Array<string>,
      followed_users?: Array<string>,
      blocked_users?: Array<string>,
      notifications?: Array<string>) {

          this._id = _id;
          this.name = name;
          this.avatar_url = avatar_url;
          this.login = login;
          this.password = password;
          this.active = active;
          this.created = new Date();
          this.role = role ? role : 'user';
          this.untrusted = false;
          this.saved_notes = [];
          this.followed_users = [];
          this.blocked_users = [];
          this.notifications = [];
  }
}
