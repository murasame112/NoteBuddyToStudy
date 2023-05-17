export class Note{
    id: number
    name: string
    author_id: number
    category_id: number
    subcategory_id: number
    pdf_adress: string
    description: string
    created: Date
    last_update: Date
    is_public: boolean
    positive_reviews: number
    negative_reviews: number

    constructor(id: number, 
        name: string,
        author_id: number,
        category_id: number,
        subcategory_id: number,
        pdf_adress: string,
        description: string,
        last_update: Date,
        is_public: boolean,
        positive_reviews: number,
        negative_reviews: number) {
        
            this.id = id;
            this.name = name;
            this.author_id = author_id;
            this.category_id = category_id;
            this.subcategory_id = subcategory_id;
            this.pdf_adress = pdf_adress;
            this.description = description;
            this.created = new Date();
            this.last_update = last_update;
            this.is_public = is_public;
            this.positive_reviews = 0;
            this.negative_reviews = 0;
    }

}