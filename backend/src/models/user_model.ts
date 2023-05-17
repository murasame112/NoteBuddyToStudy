export class User{
    id: number
    name: string
    avatar_url: string
    login: string // mail
    password: string
    active: boolean // false means banned
    created: Date
    role: string // TODO: enum
    untrusted: boolean
    saved_notes: Array<number>
    followed_users: Array<number>
    blocked_users: Array<number>
    notifications: Array<Notification>
    

    constructor(id: number, 
        name: string,
        avatar_url: string,
        login: string,
        password: string,
        active: boolean,
        created: Date,
        role?: string,
        untrusted?: boolean,
        saved_notes?: Array<number>,
        followed_users?: Array<number>,
        blocked_users?: Array<number>,
        notifications?: Array<Notification>,) {
        
        
            this.id = id;
            this.name = name;
            this.avatar_url = avatar_url;
            this.login = login;
            this.password = password;
            this.active = active;
            this.created = created;
            this.role = role ? role : 'user'; // TODO: enum
            this.untrusted = untrusted ? untrusted : false;
            this.saved_notes = saved_notes ? saved_notes : [];
            this.followed_users = followed_users ? followed_users : [];
            this.blocked_users = blocked_users ? blocked_users : [];
            this.notifications = notifications ? notifications : [];
    }

}