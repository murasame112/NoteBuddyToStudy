import { ObjectId } from 'bson';
export class Category{
    id: ObjectId
    name: string
      

    constructor(id: ObjectId, 
        name: string) {
        
            this.id = id;
            this.name = name;
    }

}