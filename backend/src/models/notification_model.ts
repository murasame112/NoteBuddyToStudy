import { ObjectId } from 'bson';
export class Notification{
    content: string

    constructor(
        content: string) {
            this.content = content;
    }

}