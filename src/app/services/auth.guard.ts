import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {
  }

  canActivate( ): Observable<boolean> {
    return this.authService.isAuth()
            .pipe(
              tap( estado => {
                console.log('anana', estado);
                if (!estado) {
                  this.router.navigate(['/login']);
                }
              })
            );
  }

}