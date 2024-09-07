// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  updateProfile(user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, user);
  }

  deleteProfile(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/profile`);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }
}
