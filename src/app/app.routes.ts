import { Routes } from '@angular/router';
import { StandardPageComponent } from './core/components/standard-page/standard-page.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: '',
        component: StandardPageComponent,
        children: [
            {
                path: 'login',
                loadChildren: () => import('./views/auth/auth.routes').then((m) => m.authRoutes),
            },
            {
                path: 'user',
                loadChildren: () => import('./views/users/users.routes').then((m) => m.userRoutes),
            },
        ],
    },
    { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
