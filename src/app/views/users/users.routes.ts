import { Route } from '@angular/router';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UsersWrapperComponent } from './components/users/users-wrapper.component';
import { UserRole } from '../../shared/types/user-roles';
import { AuthGuard } from '../../core/guards/auth.guard';

export const userRoutes: Route[] = [
    {
        path: 'new',
        component: UserProfileComponent,
        canActivate: [AuthGuard],
        data: {
            permittedRoles: [UserRole.Admin, UserRole.Operator],
            trackPageview: false,
        },
    },
    {
        path: 'list',
        component: UsersWrapperComponent,
        canActivate: [AuthGuard],
        data: {
            permittedRoles: [UserRole.Admin, UserRole.Operator, UserRole.Guest],
            trackPageview: false,
        },
    },
];
