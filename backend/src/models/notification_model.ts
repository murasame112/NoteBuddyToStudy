import { ObjectId } from 'bson';
export class Notification{
    content: string
		created_date?: Date

    constructor(
        content: string,
				created_date?: Date) {
            this.content = content;
						this.created_date = (created_date ? created_date : new Date());
    }

}