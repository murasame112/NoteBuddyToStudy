export class Group{
    id: number
    type: string // TODO: enum  
    users: Array<number>
      

    constructor(id: number, 
        type: string,
        users?: Array<number>) {
        
            this.id = id;
            this.type = type;
            this.users = users ? users : [];
    }

}