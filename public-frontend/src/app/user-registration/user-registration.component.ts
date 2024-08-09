import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';

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

  constructor(private userService: UserService) { }

    onSubmit() {
      console.log(this.user);
      if(this.user.firstName == '' || this.user.lastName == '' || 
        this.user.username == '' || this.user.email == '' || 
        this.user.password == '' || this.user.repeatPassword == '')
        return alert('Please enter all fields');
      if(this.user.password != this.user.repeatPassword)
        return alert('Passwords do not match');

      this.userService.registerUser(this.user).subscribe((data: any) => {
        alert('Registration successful');
        // clear form
        this.user = {
          firstName: '',
          lastName: '',
          username: '',
          email: '',
          password: '',
          repeatPassword: ''
        }
        console.log(data);
        })
      }
}
