import { ObjectId } from 'bson';
export class Subcategory{
    id: ObjectId
    category_id: number
    name: string
      

    constructor(id: ObjectId, 
        category_id: number,
        name: string) {
        
            this.id = id;
            this.category_id = category_id;
            this.name = name;
    }

}