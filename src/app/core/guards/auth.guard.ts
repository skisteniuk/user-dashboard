import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { UserRole } from '../../shared/types/user-roles';
import { AuthStore } from '../../views/auth/store/auth.store';
import { AuthService } from '../../views/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly authStore = inject(AuthStore);
    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const user = this.authStore.user();
        const permittedRoles = route.data['permittedRoles'] as UserRole[] | undefined;

        if (!user) {
            return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
        }

        if (permittedRoles && !this.authService.isAuthorized(user, permittedRoles)) {
            return this.router.createUrlTree(['/access-denied']);
        }

        return true;
    }
}
