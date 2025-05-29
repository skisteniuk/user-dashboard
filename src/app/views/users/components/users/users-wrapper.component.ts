import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { UsersListComponent } from '../users-list/users-list.component';
import { UsersStore } from '../../store/users.store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserProfile } from '../../types/user-profile';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { AuthStore } from '../../../auth/store/auth.store';
import { UserRoleDisplayNames } from '../../../../shared/types/user-roles';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-users',
    imports: [UsersListComponent, UserProfileComponent, MatProgressSpinnerModule, MatCardModule],
    templateUrl: './users-wrapper.component.html',
    styleUrl: './users-wrapper.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersWrapperComponent {
    readonly store = inject(UsersStore);
    readonly authStore = inject(AuthStore);
    readonly UserRoleDisplayNames = UserRoleDisplayNames;

    ngOnInit(): void {
        if (this.store.users().length === 0) {
            this.store.getAllUsers();
        }
    }
}
