import { ObjectId } from "bson";
export class Card {
  cards: Array<ObjectId>;

  constructor(
    cards?: Array<ObjectId>
  ) {
    this.cards = cards ? cards : [];
  }
}
