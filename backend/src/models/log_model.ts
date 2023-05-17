export class Logi{
    id: number
    type: string // TODO: enum
    date: Date
    content: string
      

    constructor(id: number, 
        type: string,
        content: string) {
        
            this.id = id;
            this.type = type;
            this.date = new Date();
            this.content = content;
    }

}