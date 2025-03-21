import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  // Inyectamos el servicio Router
  const router = inject(Router);

  // Verificar si el token está presente en el localStorage
  const token = localStorage.getItem('authToken');

  if (token) {
    // Aquí podrías agregar más lógica para verificar la validez del token,
    // como decodificarlo o hacer una solicitud al servidor para verificarlo.
    // Pero si solo se necesita comprobar si existe el token:
    return true;
  } else {
    // Si el token no está presente, redirigimos al usuario a la página de inicio de sesión
    router.navigate(['/']); // Redirige a la ruta del login (asumiendo que es la ruta '/')
    return false;
  }
};
