import { Type } from "../enums/log_type_enum";
export class Log {
  type: Type;
  date: Date;
  content: string;

  constructor(type: Type, content: string, date?: Date) {
    this.type = type;
    this.content = content;
    this.date = date ? date : new Date();
  }
}
