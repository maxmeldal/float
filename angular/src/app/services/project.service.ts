import {Injectable} from '@angular/core';
import {ApplicationStateService} from "./application-state.service";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, of, switchMap, take, throwError} from "rxjs";
import {Project} from "../domain/project";
import {RestFetcher} from "@northtech/bragi";
import {ErrorInfo} from "../domain/error-info";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(private state: ApplicationStateService,
              private http: HttpClient,
              private _snackbar: MatSnackBar,) {

    this.state.observe('apiUrl', 'wantedProjectId').pipe(
      switchMap(data =>
        data.wantedProjectId != null
          ? this.http.get<Project>(`${data.apiUrl}/v0/projects/${data.wantedProjectId}`)
          : of(undefined)
      )
    ).subscribe(project => this.state.set('selectedProject', project));

    this.state.observe('apiUrl', 'user').pipe(
      switchMap(data =>
        data.user != null
          ? this.http.get<Project[]>(`${data.apiUrl}/v0/users/${data.user.id}/projects`)
          : of([])
      )
    ).subscribe(projects => this.state.set('projects', projects));
  }

  selectProject(id: string | undefined): void {
    this.state.set('wantedProjectId', id);
  }

  deleteProject(id: string | undefined): void {
    this.state.observe('apiUrl', 'projects').pipe(
      take(1),
      switchMap(data => {
          if (id != null) {
            return this.http.delete<boolean>(`${data.apiUrl}/v0/projects/${id}`).pipe(catchError(this.handleError))
          } else {
            return of(undefined)
          }
        }
      )
    ).subscribe(res => {
      if (res) {
        this.state.observe('projects').pipe(
          take(1),
          switchMap(projects => of(projects.filter(project => project.id !== id)))
        ).subscribe(projects => {
          if (projects) this.state.set('projects', projects)
        });
        this._snackbar.open('Project deleted.')
      } else {
        this._snackbar.open('Failed to delete project.')
      }

    });
  }

  handleError(error: any) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}. Message: ${error.message}`;
    }
    this._snackbar.open(errorMessage);
    return throwError(() => new Error(errorMessage))
  }

  createProject(project: Project): void {
    this.state.observe('apiUrl').pipe(
      take(1),
      switchMap(url =>
        project != null
          ? this.http.post<Project>(`${url}/v0/projects`, project)
          : of(undefined)
      )
    ).subscribe(project => {
      if (project) this.state.addToList('projects', project)
    });
  }

  updateProject(project: Project): void {
    this.state.observe('apiUrl').pipe(
      take(1),
      switchMap(url =>
        project != null
          ? this.http.put<Project>(`${url}/v0/projects/${project.id}`, project)
          : of(undefined)
      )
    ).subscribe(project => {
      if (project) {
        this.state.observe('projects').pipe(
          take(1)
        ).subscribe(projects => {
          const arr: Project[] = [];
          projects.forEach(p => {
            if (p.id != project.id) {
              arr.push(p);
            }
          });
          arr.push(project);
          this.state.set('projects', arr);
        });
        this.state.set('selectedProject', project);
      }
    });
  }
}
