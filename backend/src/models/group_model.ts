import { ObjectId } from 'bson';
export class Group{
    id: ObjectId
    type: string // TODO: enum  
    users: Array<ObjectId>
      

    constructor(id: ObjectId, 
        type: string,
        users?: Array<ObjectId>) {
        
            this.id = id;
            this.type = type;
            this.users = users ? users : [];
    }

}