import { ObjectId } from 'bson';
export class Group{
    id: ObjectId
    type: string // TODO: enum  
    users: Array<number>
      

    constructor(id: ObjectId, 
        type: string,
        users?: Array<number>) {
        
            this.id = id;
            this.type = type;
            this.users = users ? users : [];
    }

}