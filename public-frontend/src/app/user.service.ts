import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient, private activeRoute: ActivatedRoute) { }
  registeruser(user: any) {
    return this.http.post<any>(`${this.baseUrl}`, user);
  }
  login(userCredentials: any) {
    return this.http.post<any>(`${this.baseUrl}/login`, userCredentials);
  }
}
