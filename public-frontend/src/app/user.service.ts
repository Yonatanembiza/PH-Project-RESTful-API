import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient, private activeRoute: ActivatedRoute) { }
  registerUser(user: any) {
    return this.http.post<any>(`${this.baseUrl}`, user);
  }
  login(userCredentials: any) {
    console.log(userCredentials);
    return this.http.post<any>(`${this.baseUrl}/login`, userCredentials);
  }
  updateUser(user: any) {
    return this.http.put<any>(`${this.baseUrl}/${user.username}`, user);
  }
  getUserByUsername(username: string) {
    return this.http.get<any>(`${this.baseUrl}/${username}`);
  }
}
