import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {TaskService} from "../../../services/task.service";
import {Task} from "../../../domain/task";


@Component({
  selector: 'float-bucket-tasks',
  templateUrl: './bucket-tasks.component.html',
  styleUrls: ['./bucket-tasks.component.scss']
})
export class BucketTasksComponent implements OnInit {
  @Input() bucketId:string | undefined;
  #tasks: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  tasks: Observable<Task[]> = this.#tasks.asObservable();



  constructor(private taskService: TaskService) {
  }

  ngOnInit(): void {
    this.taskService.getTasksFromBucketId(this.bucketId).subscribe(result => this.#tasks.next(result));
  }



}
