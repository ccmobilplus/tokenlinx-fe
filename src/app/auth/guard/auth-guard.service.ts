import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');
    /* console.log(state.url,'asdasd',state.url.includes('/sign-in' || 'sign-up'))
    if (token == null) {
      this.router.navigate(['/sign-in']);
      return false;
    }else if(token && state.url.includes('/sign-in' || 'sign-up')){
      this.router.navigate(['/home']);
      return false;
    } */
    return true;
  }
}
