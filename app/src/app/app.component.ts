import { Component, OnInit } from '@angular/core';
import { Observable, mergeMap, forkJoin, map, switchMap, concatMap, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'app';
  inputname: string = '';
  searchResults: string[] = [];
  userDetails = [];
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.executeObservable();
  }

  fakeApi1(): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next("Hello there");
        observer.complete()
      }, 2000)
    })
  }

  fakeapi2(): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next("Helloo fake2");
        observer.complete();
      }, 1000)
    })
  }

  executeObservable(): void {
    // to make multiple api calls we use this map functionalities
    // map - will execute once all observable compltes output is [fake1, fake2]
    const mapFunc = forkJoin([this.fakeApi1(), this.fakeapi2()]).pipe(
      map(results => {
        return results;
      })
    )
    mapFunc.subscribe((data) => {
      console.log("map", data)
    });

    //mergeMap - wont cancel api calls it will execute which execute first it resolves 
    // fake1
    // fake2
    const mergemapFunc = forkJoin([this.fakeApi1(), this.fakeapi2()]).pipe(
      mergeMap(results => {
        return results;
      })
    )
    mergemapFunc.subscribe((data) => {
      console.log("Merge Map", data)
    })

  }

  switchObservable() {
    const switchmapfuncData = this.fakeApi1().pipe(
      switchMap(data => {
        return data;
      })
    )
    switchmapfuncData.subscribe(data => console.log("Switch Map", data))
  }

  //switchMap

  onSearch(): void {
    console.log(this.inputname);
    const searchTerm = this.inputname;
    this.http
      .get(`https://jsonplaceholder.typicode.com/todos/1`)
      .pipe(
        switchMap((results: any) => {
          console.log(results);
          // If you need to map the data, use the map operator here
          return results;
        })
      )
      .subscribe((data: any) => {
        this.searchResults = data;
      });
  }

  //Concat map
  fetchUserDetails(): void {
    const userIds = [1, 2, 3, 4, 5];

    from(userIds)
      .pipe(
        concatMap((userId) => this.http.get<any>(`https://jsonplaceholder.typicode.com/users/${userId}`))
      )
      .subscribe((user) => {
        // this.userDetails.push(user);
      });
  }
}
