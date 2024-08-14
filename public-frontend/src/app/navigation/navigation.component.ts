import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  constructor(private router: Router) { }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  logout(): void {
    // remove everything from local storage
    // localStorage.clear();
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
