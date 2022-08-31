import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuardService } from './auth/guard/auth-guard.service';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';
const routes: Routes = [
  { path: 'sign-in', component: LoginComponent, canActivate: [AuthGuardService] },
  { path: 'sign-up', component: RegisterComponent, canActivate: [AuthGuardService] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'home/my', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'search-details/:id', component: DetailsComponent, canActivate: [AuthGuardService] },

  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
