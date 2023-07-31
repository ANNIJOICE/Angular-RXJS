import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  user = [ { 
    name: "joice",
  age: 20  }, {
    name: "Ashwin",
    age: 40
  }]

  constructor() { }

  getUserList() {
    return this.user;
  }
}
