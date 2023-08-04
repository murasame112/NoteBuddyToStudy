import { ObjectId } from 'bson';
export class Category{
    id: ObjectId
    name: string
      

    constructor(name: string) {
            this.name = name;
    }

}