import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login';
import { RegisterPage } from './pages/register/register';
import { EmailEnviadoPage } from './pages/email-enviado/email-enviado';
import { VerificarEmailPage } from './pages/verificar-email/verificar-email';
import { ForgotPasswordPage } from './pages/forgot-password/forgot-password';
import { ResetPasswordPage } from './pages/reset-password/reset-password';

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
  {
    path: 'email-enviado',
    component: EmailEnviadoPage,
  },
  {
    path: 'verificar',
    component: VerificarEmailPage,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordPage,
  },
  {
    path: 'reset-password',
    component: ResetPasswordPage,
  },
];
