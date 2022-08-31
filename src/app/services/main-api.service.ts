import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { NoteModel } from '../models';
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

  getNoteById(id: string): Observable<NoteModel> {
    return this.http.get(`${this.apiURL}note/${id}`).pipe(map(res => <NoteModel>res));
  }

  claimNote(id: string) {
    return this.http.post(`${this.apiURL}note/claim/${id}`, {id}).pipe(map(res => <NoteModel>res));
  }

}
