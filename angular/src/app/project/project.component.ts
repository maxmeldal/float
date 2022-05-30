import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {Project} from "../domain/project";
import {ApplicationStateService} from "../services/application-state.service";
import {ProjectService} from "../services/project.service";
import {DeepReadonly} from "ts-essentials";
import {ActivatedRoute, Router} from "@angular/router";
import {Bucket} from "../domain/bucket";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {User} from "../domain/user";
import {UserService} from "../services/user.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormControl, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ViewStatisticDialogComponent} from "./view-statistic-dialog/view-statistic-dialog.component";


@Component({
  selector: 'float-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']

})
export class ProjectComponent implements OnInit {

  project: Observable<Project | undefined>;
  buckets: Observable<DeepReadonly<Bucket[]>>;
  user: Observable<User | undefined>;

  constructor(private state: ApplicationStateService,
              private userService: UserService,
              private projectService: ProjectService,
              private route: ActivatedRoute,
              private router: Router,
              public dialog: MatDialog,) {
    this.project = this.state.observe('selectedProject');
    this.buckets = this.state.observe('buckets');
    this.user = this.state.observe('user');
    this.state.observe('user').subscribe(user => {
      if (!user) {
        this.router.navigate(['/login'])
      }
    });
  }

  ngOnInit(): void {
    this.projectService.selectProject(String(this.route.snapshot.paramMap.get('id')));
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  toggleSound(user: User) {
    if(user.sounds) {
      user.sounds = false;
    } else {
      user.sounds = true;
    }
    this.userService.updateUser(user)
  }

  openEditProjectDialog() {
    const dialogRef = this.dialog.open(EditProjectDialog);

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  openViewStatisticDialog() {
    const dialogRef = this.dialog.open(ViewStatisticDialogComponent, {
      width: "100vw",
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }
}





@Component({
  selector: 'edit-project-dialog',
  templateUrl: 'edit-project-dialog.html'
})
export class EditProjectDialog {
  project: Observable<Project | undefined>;

  name = new FormControl('', [Validators.required]);
  description = new FormControl('');
  deadline = new FormControl('');
  hourEstimate = new FormControl('');
  price = new FormControl('');
  private user: User | undefined;

  constructor(private state: ApplicationStateService,
              private projectService: ProjectService,
              private router: Router,
              private route: ActivatedRoute,
              private _snackbar: MatSnackBar,
              public dialogRef: MatDialogRef<EditProjectDialog>) {
    this.project = this.state.observe('selectedProject');
    this.project.subscribe(p => {
      this.name.setValue(p?.name)
      this.description.setValue(p?.description)
      this.deadline.setValue(p?.deadline)
      this.hourEstimate.setValue(p?.hourEstimate)
      this.price.setValue(p?.price)
    })
    this.state.observe('user').subscribe(user => {
      if (!user) {
        this.router.navigate(['/login'])
      } else {
        this.user = user;
      }
    });
  }


  submit(): void {
    if (!this.name.hasError('required')) {
      this.state.observe('wantedProjectId').subscribe(
        id => {
            if (id != null && this.user) {
              const name = this.name.value;
              const description = this.description.value;
              const deadline = new Date(this.deadline.value);
              const hourEstimate = this.hourEstimate.value;
              const price = this.price.value;
              const project: Project = {
                id,
                name,
                description,
                createdAt: undefined,
                deadline,
                hourEstimate,
                price,
                userId: this.user.id
              }
              this.projectService.updateProject(project);
              this.dialogRef.close();
            } else {
              this._snackbar.open('Please fill out required fields.')
            }
          }

      )
    }
  }


}
