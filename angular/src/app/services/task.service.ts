import {Injectable} from '@angular/core';
import {ApplicationStateService} from "./application-state.service";
import {Observable, of, switchMap, take} from "rxjs";
import {Task} from "../domain/task";
import {HttpClient} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private state: ApplicationStateService,
              private http: HttpClient,
              private _snackbar: MatSnackBar,) {
  }

  updateTask(task: Task): void {
    this.state.observe('apiUrl').pipe(
      take(1),
      switchMap(url =>
        task != null
          ? this.http.put<Task>(`${url}/v0/tasks/${task.id}`, task)
          : of(undefined)
      )
    ).subscribe();
  }

  createTask(task: Task): Observable<Task> {
    return this.state.observe('apiUrl').pipe(
      take(1),
      switchMap(url =>
        this.http.post<Task>(`${url}/v0/tasks`, task)
      )
    )
  }

  getTasksFromBucketId(bucketId: String | undefined): Observable<Task[]> {
    return this.state.observe('apiUrl').pipe(
      take(1),
      switchMap(url =>
        this.http.get<Task[]>(`${url}/v0/buckets/${(bucketId)}/tasks`)
      )
    )
  }

  delete(id: string | undefined) {
    this.state.observe('apiUrl').pipe(
      take(1),
      switchMap(url =>
        id != null
          ? this.http.delete<boolean>(`${url}/v0/tasks/${id}`)
          : of(undefined)
      )
    ).subscribe(res =>{
      if (res){
        this._snackbar.open('Task deleted.')
      } else {
        this._snackbar.open('Failed to delete task.')
      }
    })
  }
}
