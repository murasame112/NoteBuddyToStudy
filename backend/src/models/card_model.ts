import { ObjectId } from 'bson';
export class Card{
    id: ObjectId
    questions: string
    answers: string
      

    constructor(id: ObjectId, 
        questions: string,
        answers: string) {
        
            this.id = id;
            this.questions = questions;
            this.answers = answers;
    }

}