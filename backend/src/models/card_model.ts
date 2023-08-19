export class Card{
    questions: Array<string>
    answers: Array<string>
      

    constructor( 
        questions: Array<string>,
        answers: Array<string>) {

            this.questions = questions;
            this.answers = answers;
    }

}