import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserDocService {
  private userDocPath: string = '/assets/dokumentacja_uzytkownika.pdf';

  constructor() {}

  getUserDocPath(): string {
    return this.userDocPath;
  }
}
