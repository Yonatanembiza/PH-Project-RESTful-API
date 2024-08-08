import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent {
  user= {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    newPassword: '',
    repeatPassword: ''
  };
  constructor(private userService: UserService) { }

  onSubmit() {
    if(this.user.firstName == '' || this.user.lastName == '' || 
      this.user.username == '' || this.user.email == '' || 
      this.user.newPassword == '' || this.user.repeatPassword == '')
      return alert('Please enter all fields');
    if(this.user.newPassword != this.user.repeatPassword)
      return alert('Passwords do not match');
    let existingUser = this.userService.getUserByUsername(this.user.username);
    if(!existingUser)
      return alert('User does not exist');
    this.userService.updateUser(this.user).subscribe((data: any) => {
      alert('User updated successfully');
      // clear form
      this.user = {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        newPassword: '',
        repeatPassword: ''
      }
      console.log(data);
      })
    }
}
