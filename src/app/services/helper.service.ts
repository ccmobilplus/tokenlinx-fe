import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  private authenticate = new Subject<any>();
  constructor() { }

  sendMesg(obj:any) {
    this.authenticate.next(obj);
  }
 
  onAuthMessage(): Observable<any> {
    return this.authenticate.asObservable();
  }
}
