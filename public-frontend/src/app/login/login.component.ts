import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginCredentials= {
    username: '',
    password: ''
  }
  constructor(private userService: UserService) { }
  onSubmit() {
    if(this.loginCredentials.username == '' || this.loginCredentials.password == '') 
      return alert('Please enter username and password');
    this.userService.login(this.loginCredentials).subscribe((data: any) => {
      console.log(data);
    })
  }
}
