import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login';
import { RegisterPage } from './pages/register/register';

export const authRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginPage,
    // canActivate: [guestGuard]  ← agregar cuando esté implementado
  },
  {
    path: 'register',
    component: RegisterPage,
    // canActivate: [guestGuard]  ← agregar cuando esté implementado
  },
];
