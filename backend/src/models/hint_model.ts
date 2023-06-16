import { ObjectId } from 'bson';
export class Hint{
    id: ObjectId
    content: string
      

    constructor(id: ObjectId, 
        content: string) {
        
            this.id = id;
            this.content = content;
    }

}