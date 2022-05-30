import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../services/user.service";
import {ApplicationStateService} from "../services/application-state.service";
import {Router} from "@angular/router";

@Component({
  selector: 'float-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);

  constructor(private _snackbar: MatSnackBar,
              private userService: UserService,
              private state: ApplicationStateService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  submit(): void {
    if (this.username.hasError('required') || this.password.hasError('required')) {
      this._snackbar.open('Please fill out required fields.')
    } else {
      this.userService.login(
        {id: undefined, username: this.username.value, password: this.password.value, sounds: undefined}
      ).subscribe(
        user => {
          if (user.id) {
            this.state.set('user', user);
          }
        },
        error => {
          this._snackbar.open('Bad credentials');
        },
        () => {
          this.router.navigate(['/projects']);
        }
      )
    }
  }

}
