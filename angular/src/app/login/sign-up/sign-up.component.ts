import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ApplicationStateService} from "../../services/application-state.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'float-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);

  constructor(private router: Router,
              private _snackbar: MatSnackBar,
              private state: ApplicationStateService,
              private userService: UserService) {
  }

  ngOnInit(): void {
  }

  submit() {
    if (!this.username.hasError('required') && !this.password.hasError('required')) {
      this.userService.createUser({id: undefined, username: this.username.value, password: this.password.value, sounds: undefined})
        .subscribe(user =>
          user != null
            ? this.router.navigate(['/login'])
            : this._snackbar.open('Failed to create user'))
    } else {
      this._snackbar.open('Please fill out required fields.')
    }
  }
}
