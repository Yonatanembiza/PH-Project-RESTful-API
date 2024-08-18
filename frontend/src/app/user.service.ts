import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _baseUrl = environment.apiUrl + '/users';

  constructor(private _httpClient: HttpClient, private activeRoute: ActivatedRoute) { }
  registerUser(user: any) {
    return this._httpClient.post<any>(`${this._baseUrl}`, user);
  }
  login(userCredentials: any) {
    console.log(userCredentials);
    return this._httpClient.post<any>(`${this._baseUrl}/login`, userCredentials);
  }
  updateUser(user: any) {
    return this._httpClient.put<any>(`${this._baseUrl}/${user.username}`, user);
  }
  getUserByUsername(username: string) {
    return this._httpClient.get<any>(`${this._baseUrl}/${username}`);
  }
}
