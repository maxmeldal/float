import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HomeComponent } from './home/home.component';
import {MatButtonModule} from "@angular/material/button";
import {CreateProjectDialog, DeleteProjectDialog, ProjectsComponent} from './projects/projects.component';
import {MatTableModule} from "@angular/material/table";
import {EditProjectDialog, ProjectComponent} from './project/project.component';
import {MatIconModule} from "@angular/material/icon";
import {MatDialogModule} from "@angular/material/dialog";
import {MatMenuModule} from "@angular/material/menu";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {BucketComponent, EditTaskDialog} from './project/bucket/bucket.component';
import { LoginComponent } from './login/login.component';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from "@angular/material/snack-bar";
import { SignUpComponent } from './login/sign-up/sign-up.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatTooltipModule} from "@angular/material/tooltip";
import { ViewStatisticDialogComponent } from './project/view-statistic-dialog/view-statistic-dialog.component';
import { BucketTasksComponent } from './project/view-statistic-dialog/bucket-tasks/bucket-tasks.component';
import {MatCardModule} from "@angular/material/card";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatSelectModule} from "@angular/material/select";

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    ProjectsComponent,
    ProjectComponent,
    DeleteProjectDialog,
    CreateProjectDialog,
    EditProjectDialog,
    BucketComponent,
    EditTaskDialog,
    LoginComponent,
    SignUpComponent,
    ViewStatisticDialogComponent,
    BucketTasksComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    MatMenuModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    DragDropModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatCardModule,
    MatProgressBarModule,
    MatSelectModule
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
