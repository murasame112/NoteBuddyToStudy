export class Message {

  login: string;
	content: string;
	date: Date;

  constructor(login: string, content: string, date: Date) {
    this.login = login;
		this.content = content;
		this.date = date;
  }
}
