export class User{
    _id?:string
    login: string
    avatar_url: string
    email: string
    password: string
    active: boolean
    created: Date
    role: string
    untrusted: boolean
    saved_notes: Array<string>
    followed_users: Array<string>
    blocked_users: Array<string>


    constructor(
      login: string,
      avatar_url: string,
      email: string,
      password: string,
      active: boolean,
      _id?:string,
      role?: string,
      untrusted?: boolean,
      saved_notes?: Array<string>,
      followed_users?: Array<string>,
      blocked_users?: Array<string>) {

          this._id = _id;
          this.email = email;
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

  }
}

//! name to teraz login
//! to co kiedys bylo loginem teraz jest email
