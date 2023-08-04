import { ObjectId } from 'bson';
export class Subcategory{
    id: ObjectId
    category_id: ObjectId
    name: string
      

    constructor(
        category_id: ObjectId,
        name: string) {
            this.category_id = category_id;
            this.name = name;
    }

}