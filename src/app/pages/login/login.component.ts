import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ILogin } from '../../core/interfaces/http';
import { AuthService } from '../../core/service/auth.service';
import { NotifecationsService } from '../../core/service/notifecations.service';
import { UserDataService } from '../../core/service/user-data.service';
import { SharedModule } from '../../shared/module/shared/shared.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule , CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
  email!: FormControl;
  password!: FormControl;
  loginForm!: FormGroup;

  constructor(
    private authService_: AuthService,
    private _notifecationsService: NotifecationsService,
    private router: Router,
    private _userData: UserDataService
  ) {
    this.initFormControls();
    this.initFormGroupe();
  }

  initFormControls(): void {
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(8),Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/)]);
  }

  initFormGroupe(): void {
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password,
    });
  }

  submit() {
    if (this.loginForm.valid) {
      this.siginIn(this.loginForm.value);
    } else {
      this.loginForm.markAllAsTouched();
      Object.keys(this.loginForm.controls).forEach((control) =>
        this.loginForm.controls[control].markAsDirty()
      );
    }
  }

  siginIn(data: ILogin): void {
    this.authService_.login(data).subscribe({
      next: (response) => {
        if (response._id) {
          this._notifecationsService.showSuccess('success', 'success login');
          localStorage.setItem('token', response._id);
          this._userData.userName.next(response.name);
          localStorage.setItem('username', response.name);
        }
        this.router.navigate(['home']);
      },
      error: (err) => {
        this._notifecationsService.showError('Error', err.error.error);
      },
    });
  }


  showPassword: boolean = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }


}
