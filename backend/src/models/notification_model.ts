import { ObjectId } from 'bson';
export class Notification{
    id: ObjectId
    content: string
      

    constructor(id: ObjectId,
        content: string) {
        
            this.id = id;
            this.content = content;
    }

}