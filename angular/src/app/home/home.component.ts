import { Component, OnInit } from '@angular/core';
import {Project} from "../domain/project";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'float-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  msg: Observable<Project>;

  constructor(private http: HttpClient) {
    this.msg = this.http.get<Project>("http://localhost:8080/api/v0/hello");
  }

  ngOnInit(): void {
  }

}
