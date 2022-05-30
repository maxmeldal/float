import { Injectable } from '@angular/core';
import {ApplicationStateService} from "./application-state.service";
import {HttpClient} from "@angular/common/http";
import {of, switchMap} from "rxjs";
import {Bucket} from "../domain/bucket";

@Injectable({
  providedIn: 'root'
})
export class BucketService {

  constructor(private state: ApplicationStateService,
              private http: HttpClient,) {
    this.state.observe('apiUrl', 'selectedProject').pipe(
      switchMap(data =>
      data.selectedProject != null
        ? this.http.get<Bucket[]>(`${data.apiUrl}/v0/projects/${data.selectedProject.id}/buckets`)
        : of([])
      )
    ).subscribe(buckets => this.state.set('buckets', buckets));
  }

  getBuckets(): void {
    this.state.observe('apiUrl', 'selectedProject').pipe(
      switchMap(data =>
        data.selectedProject != null
          ? this.http.get<Bucket[]>(`${data.apiUrl}/v0/projects/${data.selectedProject.id}/buckets`)
          : of([])
      )
    ).subscribe(buckets => this.state.set('buckets', buckets));
  }
}
