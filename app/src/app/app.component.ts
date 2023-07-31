import { Component, OnInit, Optional, inject } from '@angular/core';
import { Observable, mergeMap, forkJoin, map, switchMap, concatMap, from, Subject, BehaviorSubject, ReplaySubject, AsyncSubject, of, filter } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppService } from './app.service';
import { ActivatedRoute } from '@angular/router';
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
  subjectData = new Subject();
  behaviorSubjet = new BehaviorSubject("0");
  replaySubject$ = new ReplaySubject();
  asyncSubject = new AsyncSubject();
  userService = inject(AppService)
  page$ = inject(ActivatedRoute).queryParams.pipe(
    filter((params) => params['page']),
    map((params)=> params['page'])
  )
  
  constructor(private http: HttpClient,
    @Optional() private service1: AppService ) {}
  
  ngOnInit(): void {
    this.fromOfDiff()
    console.log(this.userService.getUserList());

    //Subject op - 3
    console.log(" Subject starts")

    this.subjectData.next(1);
    this.subjectData.next(2);
    this.subjectData.subscribe((res) => {
      console.log(res)
    })
    this.subjectData.next(3);
    this.subjectData.complete()

    //Behaviour op - 
    // Sub1 0
    // Sub1 1
    // Sub1 2
    // sub2 2
    // Sub1 3
    // sub2 3
    console.log("Behavior Subject starts")

    this.behaviorSubjet.next("1234")
    this.behaviorSubjet.subscribe(val => {
      console.log("Sub1 " + val);
    });
 
    this.behaviorSubjet.next("1");
    this.behaviorSubjet.next("2");
 
    this.behaviorSubjet.subscribe(val => {
      console.log("sub2 " + val);
    });
 
    this.behaviorSubjet.next("3");
    this.behaviorSubjet.complete();

    // Replay Subject
    console.log("Replay Subject starts")
    this.replaySubject$.next("1");
    this.replaySubject$.next("2");
 
    this.replaySubject$.subscribe(
      val => console.log("Sub1 " + val),
      err => console.error("Sub1 " + err),
      () => console.log("Sub1 Complete")
    );
 
    this.replaySubject$.next("3");
    this.replaySubject$.next("4");
 
    this.replaySubject$.subscribe(val => {
      console.log("sub2 " + val);
    });
 
    this.replaySubject$.next("5");
    this.replaySubject$.complete();
 
    this.replaySubject$.error("err");
    this.replaySubject$.next("6");
 
    this.replaySubject$.subscribe(
      val => {
        console.log("sub3 " + val);
      },
      err => console.error("sub3 " + err),
      () => console.log("Complete")
    );


    // Async Subject
    // Output
    // Sub1 5
    // sub2 5
    // Sub1 Complete
    // Sub3 5
    // Sub3 Complete
    this.asyncSubject.next("1");
    this.asyncSubject.next("2");
 
    this.asyncSubject.subscribe(
      val => console.log("Sub1 " + val),
      err => console.error("Sub1 " + err),
      () => console.log("Sub1 Complete")
    );
 
    this.asyncSubject.next("3");
    this.asyncSubject.next("4");
 
    this.asyncSubject.subscribe(val => {
      console.log("sub2 " + val);
    });
 
    this.asyncSubject.next("5");
    this.asyncSubject.complete();
 
    this.asyncSubject.error("err");
 
    this.asyncSubject.next("6");
 
    this.asyncSubject.subscribe(
      val => console.log("Sub3 " + val),
      err => console.error("sub3 " + err),
      () => console.log("Sub3 Complete")
    );
  }

  fromOfDiff():void {
    from([1,2,3]).subscribe(x => console.log("from", x));
    of([1,2,3]).subscribe(x => console.log("of", x));

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
