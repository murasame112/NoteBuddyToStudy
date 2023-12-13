import { ObjectId } from "bson";
export class CardCollection {
  cards: Array<ObjectId>;

  constructor(
    cards?: Array<ObjectId>
  ) {
    this.cards = cards ? cards : [];
  }
}
