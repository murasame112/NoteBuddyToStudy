import { ObjectId } from 'bson';
export class Card{
    id: ObjectId
    questions: Array<string>
    answers: Array<string>
      

    constructor(id: ObjectId, 
        questions: Array<string>,
        answers: Array<string>) {
        
            this.id = id;
            this.questions = questions;
            this.answers = answers;
    }

}