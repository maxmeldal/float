import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ProjectsComponent} from "./projects/projects.component";
import {ProjectComponent} from "./project/project.component";
import {LoginComponent} from "./login/login.component";
import {SignUpComponent} from "./login/sign-up/sign-up.component";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'sign-up', component:SignUpComponent},
  {path: 'projects',  component: ProjectsComponent},
  {path: 'projects/:id', component: ProjectComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
