import { ObjectId } from 'bson';
export class User{
    id: ObjectId
    name: string
    avatar_url: string
    login: string // mail
    password: string
    active: boolean // false means banned
    created: Date
    role: string // TODO: enum
    untrusted: boolean
    saved_notes: Array<ObjectId>
    followed_users: Array<ObjectId>
    blocked_users: Array<ObjectId>
    notifications: Array<Notification>
    

    constructor(id: ObjectId, 
        name: string,
        avatar_url: string,
        login: string,
        password: string,
        active: boolean,
        role?: string,
        untrusted?: boolean,
        saved_notes?: Array<ObjectId>,
        followed_users?: Array<ObjectId>,
        blocked_users?: Array<ObjectId>,
        notifications?: Array<Notification>) {

            this.id = id;
            this.name = name;
            this.avatar_url = avatar_url;
            this.login = login;
            this.password = password;
            this.active = active;
            this.created = new Date();
            this.role = role ? role : 'user'; // TODO: enum
            this.untrusted = false;
            this.saved_notes = [];
            this.followed_users = [];
            this.blocked_users = [];
            this.notifications = [];
    }

}