import {Component, Inject, Input, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {HttpClient} from "@angular/common/http";
import {Task} from "../../domain/task";
import {BehaviorSubject, Observable, take} from "rxjs";
import {TaskService} from "../../services/task.service";
import {FormControl, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ApplicationStateService} from "../../services/application-state.service";
import {User} from "../../domain/user";

@Component({
  selector: 'float-bucket',
  templateUrl: './bucket.component.html',
  styleUrls: ['./bucket.component.scss']
})
export class BucketComponent implements OnInit {
  @Input() bucketId: string | undefined;
  @Input() bucketName: string | undefined;

  #tasks: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  tasks: Observable<Task[]> = this.#tasks.asObservable();
  user: Observable<User | undefined>

  name = new FormControl('', [Validators.required]);

  constructor(private state: ApplicationStateService,
              private http: HttpClient,
              private taskService: TaskService,
              public dialog: MatDialog) {
    this.user = this.state.observe('user');
  }

  ngOnInit(): void {
    this.taskService.getTasksFromBucketId(this.bucketId).subscribe(result => this.#tasks.next(result));
  }
  onSubmit(): void{
    if(this.bucketId && !this.name.hasError('required')){
      const task: Task = {id: undefined, name: this.name.value, description: undefined, bucketId: this.bucketId, color: undefined}
      this.taskService.createTask(task).subscribe(result => {
        this.#tasks.next(this.#tasks.value.concat(result))
        this.name.setValue('');
      });
      this.user.pipe(take(1)).subscribe(user =>
      {if(user?.sounds){
        this.playSound();
      }}
      );
    }
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (this.bucketId != null) {
      let task = event.previousContainer.data[event.previousIndex];
      const update: Task = {id: task.id, name: task.name, description: task.description, bucketId: this.bucketId, color: task.color};
      this.taskService.updateTask(update);
    }
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.user.pipe(take(1)).subscribe(user =>
        {if(user?.sounds){
          this.playSound();
        }}
      );
    }
  }

  playSound(): void{
      const audio = new Audio();
      if(this.bucketName)
      audio.src = `../../assets/peasant-soundpack/${this.bucketName.toLowerCase()}.m4a`
      audio.load();
      audio.play();
  }

  taskClicked(task: Task):void {
    const prevName = task.name;
    const prevDesc = task.description;
    const prevColor = task.color;
    const dialogRef = this.dialog.open(EditTaskDialog, {
      width: '30vw',
      data: task
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.id){
        const arr = this.#tasks.value;
        arr.forEach((task, index) => {
          if (task.id == result.id) { arr.splice(index, 1)}
        });
        arr.push(result);
        this.#tasks.next(arr);
        this.taskService.updateTask(result);
      } else if(result){
        this.taskService.getTasksFromBucketId(this.bucketId).subscribe(result => this.#tasks.next(result));
      } else {
        task.name = prevName;
        task.description = prevDesc;
        task.color = prevColor;
      }
    });
  }
}

@Component({
  selector: 'edit-task-dialog',
  templateUrl: 'edit-task-dialog.html',
})
export class EditTaskDialog {
  constructor(
    public dialogRef: MatDialogRef<EditTaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Task,
    private taskService: TaskService
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onDeleteClick(id: string | undefined): void {
    this.taskService.delete(id);
    this.dialogRef.close({"deleted": true});
  }
}
