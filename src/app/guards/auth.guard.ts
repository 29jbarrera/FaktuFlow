import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

function isTokenValid(token: string): boolean {
  try {
    const decoded: any = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp && decoded.exp > now;
  } catch (e) {
    console.error('Token inválido:', e);
    return false;
  }
}

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = sessionStorage.getItem('authToken');

  if (token && isTokenValid(token)) {
    return true;
  } else {
    sessionStorage.removeItem('authToken'); // Limpieza opcional
    router.navigate(['/']);
    return false;
  }
};
