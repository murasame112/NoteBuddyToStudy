import { ObjectId } from 'bson';
export class Logi{
    id: ObjectId
    type: string // TODO: enum
    date: Date
    content: string
      

    constructor(id: ObjectId, 
        type: string,
        content: string) {
        
            this.id = id;
            this.type = type;
            this.date = new Date();
            this.content = content;
    }

}