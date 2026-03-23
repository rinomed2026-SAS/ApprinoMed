import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.isAuthenticated().pipe(
    map((token) => {
      if (token) {
        return true;
      }
      router.navigate(['/login']);
      return false;
    })
  );
};
