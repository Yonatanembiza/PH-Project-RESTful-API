import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  constructor(private router: Router, private _authService: AuthService) { }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  logout(): void {
    // remove token from local storage
    this._authService.removeToken();
    this.router.navigate(['/home']);
  }

  getUserName(): Object {
    // get name from local storage
    return localStorage.getItem('user') || '';
  }
}
