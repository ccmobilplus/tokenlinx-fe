import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public apiURL = '';
  constructor(
    private http: HttpClient) {
      this.apiURL = environment.apiUrl;
  }

  createUser(body: any){
    return this.http.post(this.apiURL + 'auth/create-user', body)
  }

  login(body: any){
    return this.http.post(this.apiURL + 'auth/login', body)
  }
}
