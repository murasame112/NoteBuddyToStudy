import { ObjectId } from 'bson';
import { Type } from '../enums/group_type_enum';
export class Group{
    type: Type
    users: Array<ObjectId>

    constructor(
        type: Type,
        users?: Array<ObjectId>) {
        
            this.type = type;
            this.users = users ? users : [];
    }

}