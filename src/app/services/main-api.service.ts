import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
@Injectable({
  providedIn: 'root'
})
export class MainApiService {
  public apiURL = '';
  constructor(
    private http: HttpClient) {
      this.apiURL = environment.apiUrl;
  }

  getSearchResult(queryParams: any){
    return this.http.get(`${this.apiURL}note/list${queryParams}`)
  }

}
