import {Component, OnInit, ViewChild} from '@angular/core';
import {combineLatest, map, Observable, startWith} from "rxjs";
import {Project} from "../domain/project";
import {ApplicationStateService} from "../services/application-state.service";
import {DeepReadonly} from 'ts-essentials';
import {ProjectService} from "../services/project.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {FormControl, Validators} from "@angular/forms";
import {User} from "../domain/user";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatTableDataSource} from "@angular/material/table";
import { TrigramIndex } from '@northtech/ginnungagap';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";


@Component({
  selector: 'float-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {

  projects: Observable<DeepReadonly<Project[]>>;
  columns: string[] = ['createdAt', 'name', 'hourEstimate', 'price', 'deadline', 'select'];
  searchInput = new FormControl();
  dataSource = new MatTableDataSource<Project>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private state: ApplicationStateService,
              private projectService: ProjectService,
              public dialog: MatDialog,
              private router: Router) {
    this.projects = this.state.observe('projects');
    this.state.observe('user').subscribe(user => {
      if (!user){
        this.router.navigate(['/login'])
      }
    });
  }

  ngOnInit(): void {
    const trigram = this.state.observe('projects').pipe(map(projects => TrigramIndex.of(projects).emptySearchReturnsAll()));
    combineLatest([trigram, this.searchInput.valueChanges.pipe(startWith(this.searchInput.value))]).subscribe(([index, search]) => {
      this.dataSource.data = index.find(search);
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDialog(id: string): void {
    const dialogRef = this.dialog.open(DeleteProjectDialog);

    dialogRef.afterClosed().subscribe(result => {
      result ? this.projectService.deleteProject(id) : console.log("Cancelled")
    })
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(CreateProjectDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

@Component({

  selector: 'delete-project-dialog',
  templateUrl: 'delete-project-dialog.html'
})
export class DeleteProjectDialog{}

@Component({
  selector: 'create-project-dialog',
  templateUrl: 'create-project-dialog.html'
})
export class CreateProjectDialog{
  name = new FormControl('', [Validators.required]);
  description = new FormControl('');
  deadline = new FormControl('');
  hourEstimate = new FormControl('');
  price = new FormControl('');
  user: User | undefined;

  constructor(private projectService: ProjectService,
              private router: Router,
              private _snackbar: MatSnackBar,
              private state: ApplicationStateService,
              public dialogRef: MatDialogRef<CreateProjectDialog>) {
    this.state.observe('user').subscribe(user => {
      if (!user){
        this.router.navigate(['/login'])
      } else{
        this.user = user;
      }
    });
  }

  submit(): void{
    if(!this.name.hasError('required') && this.user){
      const id = undefined;
      const name = this.name.value;
      const description = this.description.value;
      const createdAt = new Date();
      const deadline = new Date(this.deadline.value);
      const hourEstimate = this.hourEstimate.value;
      const price = this.price.value;
      const project: Project = {id, name, description, createdAt, deadline, hourEstimate, price, userId: this.user.id}
      this.projectService.createProject(project);
      this.dialogRef.close();
    } else {
      this._snackbar.open('Please fill out required fields.')
    }
  }
}
