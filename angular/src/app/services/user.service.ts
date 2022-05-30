import { Injectable } from '@angular/core';
import {User} from "../domain/user";
import {Observable, of, switchMap, take} from "rxjs";
import {ApplicationStateService} from "./application-state.service";
import {HttpClient} from "@angular/common/http";
import {Task} from "../domain/task";
import {Project} from "../domain/project";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private state: ApplicationStateService,
              private http: HttpClient,) { }

  login(user: User): Observable<User>{
    return this.state.observe('apiUrl').pipe(
      take(1),
      switchMap(url =>
        this.http.get<User>(`${url}/v0/users/${user.username}+${user.password}`)
      )
    )
  }

  createUser(user: User): Observable<User>{
    return this.state.observe('apiUrl').pipe(
      take(1),
      switchMap(url =>
        this.http.post<User>(`${url}/v0/users`, user)
      )
    );
  }

  updateUser(user: User): void {
    this.state.observe('apiUrl').pipe(
      take(1),
      switchMap(url =>
        user != null
          ? this.http.put<User>(`${url}/v0/users/${user.id}`, user)
          : of(undefined)
      )
    ).subscribe(user => {
      if (user) {
        this.state.set('user', user);
      }
    });
  }
}
