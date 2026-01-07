import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {jwtDecode} from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private api = 'http://localhost:5209/api/auth';

  constructor(private http: HttpClient) {}

  login(data:any){
    return this.http.post<any>(`${this.api}/login`, data, { responseType: 'json' });
  }

  saveLogin(token: string) {
  console.log('Saving token:', token);
  localStorage.setItem("token", token);

  const decoded: any = jwtDecode(token);
  const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  console.log('Decoded role:', role);
  localStorage.setItem("role", role);
}

 register(data: any){
    return this.http.post(`${this.api}/register`, data, { responseType: 'text' });
  }
  getRole(){
    return localStorage.getItem("role");
  }

  isLoggedIn(){
    return !!localStorage.getItem("token");
  }

  logout(){
    console.log('Logging out...');
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }
}
