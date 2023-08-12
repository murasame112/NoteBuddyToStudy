
export class Log{

    type: string // TODO: enum
    date: Date
    content: string
      

    constructor(
        type: string,
        content: string,
        date?: Date) {

            this.type = type;
            this.content = content;
            this.date = (date ? date : new Date());
    }

}