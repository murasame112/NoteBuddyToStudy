export class Card{
    id: number
    questions: string
    answers: string
      

    constructor(id: number, 
        questions: string,
        answers: string) {
        
            this.id = id;
            this.questions = questions;
            this.answers = answers;
    }

}