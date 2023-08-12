import { ObjectId } from 'bson';
export class Group{
    type: string // TODO: enum  
    users: Array<ObjectId>

    constructor(
        type: string,
        users?: Array<ObjectId>) {
        
            this.type = type;
            this.users = users ? users : [];
    }

}