// TODO: zmienić wszędzie te id na string
export class Note{
    name: string
    author_id: number
    category_id: number
    subcategory_id: number
    adress: string
    description: string
    shared_date: Date
    last_edit_date: Date
    published: boolean
    positive_reviews: number
    negative_reviews: number

    constructor( 
        name: string,
        author_id: number,
        category_id: number,
        subcategory_id: number,
        adress: string,
        description: string,
        shared_date: Date,
        last_edit_date: Date,
        published: boolean,
        positive_reviews: number,
        negative_reviews: number) {
        
            this.name = name;
            this.author_id = author_id;
            this.category_id = category_id;
            this.subcategory_id = subcategory_id;
            this.adress = adress;
            this.description = description;
            this.shared_date = shared_date;
            this.last_edit_date = last_edit_date;
            this.published = published;
            this.positive_reviews = positive_reviews;
            this.negative_reviews = negative_reviews;
    }

}