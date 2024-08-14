import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.css'
})
export class UserRegistrationComponent {
  user= {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    repeatPassword: ''
  }

  constructor(private userService: UserService, private router: Router) { }

  onSubmit() {
    console.log(this.user);
    
    if (
      this.user.firstName.trim() === '' || 
      this.user.lastName.trim() === '' || 
      this.user.username.trim() === '' || 
      this.user.email.trim() === '' || 
      this.user.password.trim() === '' || 
      this.user.repeatPassword.trim() === ''
    ) {
      return alert('Please enter all fields');
    }
  
    if (this.user.password !== this.user.repeatPassword) {
      return alert('Passwords do not match');
    }
  
    this.userService.registerUser(this.user).subscribe(
      (data: any) => {
        alert('Registration successful');  
        console.log(data);
  
        this.router.navigate(['/home']);
      },
      (err) => {
        if (err.status === 409) {
          return alert('Username: This username already taken');
        }
        if (err.status === 500) {
          return alert('Server error, please try again later');
        }
        alert('An error occurred during registration, please try again.');
      }
    );
  }
}
