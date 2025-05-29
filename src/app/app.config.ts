import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { UsersStore } from './views/users/store/users.store';
import { AuthStore } from './views/auth/store/auth.store';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthService } from './views/auth/auth.service';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient(withInterceptorsFromDi()),
        UsersStore,
        AuthStore,
        AuthGuard,
    ],
};
