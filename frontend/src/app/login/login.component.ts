import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginCredentials= {
    username: '',
    password: ''
  }
  constructor(private userService: UserService,
     private _authService: AuthService, 
     private router: Router
    ) { }
  onSubmit() {
    if (this.loginCredentials.username.trim() === '' || this.loginCredentials.password.trim() === '') {
      return alert('Please enter both username and password');
    }
  
    this.userService.login(this.loginCredentials).subscribe(
      (data: any) => {
        if (!data.token || data.token.trim() === '') {
          return alert('Invalid credentials, please try again');
        }
  
        // Check if the response contains an unexpected format
        if (!data.hasOwnProperty('token')) {
          return alert('Unexpected response format, please contact support');
        }
  
        // Successful login: store the token
        this._authService.storeToken(data.token);
        // hello user - get name from data
        // alert(`Hello ${data.user.firstName}` + ' ' + `${data.user.lastName}`);
        // store the user in local storage
        localStorage.setItem('user', data.user.firstName.toUpperCase() + ' ' + data.user.lastName.toUpperCase());
        // clear the form
        this.loginCredentials.username = '';
        this.loginCredentials.password = '';
  
        this.router.navigate(['/home']);
      },
      (err) => {
        if (err.status === 401) {
          return alert('Unauthorized: Invalid username or password');
        } else if (err.status === 500) {
          return alert('Server error, please try again later');
        } else if (err.status === 0) {
          return alert('Network error, please check your connection');
        } else {
          return alert('Check your login credentials and try again');
        }
      }
    );
  }
}
