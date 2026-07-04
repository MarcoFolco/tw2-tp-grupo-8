import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../modules/auth/services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUser()?.rol === 'ADMIN') {
    return true;
  }
    const usuario = authService.currentUser();
    console.log("El Guardia está revisando a este usuario:", usuario);

  if (usuario?.rol === 'ADMIN') {
    return true; 
  } 
  router.navigate(['/404']); 
  return false;
  };