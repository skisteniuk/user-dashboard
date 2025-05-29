import { Component, effect, input, model } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { cities, filterCitiesByName } from '../../types/cities';
import { UserProfile } from '../../types/user-profile';
import { UsersStore } from '../../store/users.store';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthStore } from '../../../auth/store/auth.store';
import { UserRole } from '../../../../shared/types/user-roles';

@Component({
    selector: 'app-user-profile',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconButton,
        MatIconModule,
        MatCardModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        AsyncPipe,
    ],
    templateUrl: './user-profile.component.html',
    styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {
    readonly store = inject(UsersStore);
    readonly authStore = inject(AuthStore);
    private readonly router = inject(Router);
    formBuilder = inject(FormBuilder);
    form: FormGroup<UserProfileForm> = this.formBuilder.group({
        firstName: [this.store.editedUser()?.firstName || '', Validators.required],
        lastName: [this.store.editedUser()?.lastName || '', Validators.required],
        nickName: [this.store.editedUser()?.nickName || ''],
        email: [this.store.editedUser()?.email || '', [Validators.required, Validators.email]],
        mobilePhone: [
            this.store.editedUser()?.mobilePhone || '',
            [Validators.required, Validators.pattern(/^\d{7,15}$/)],
        ],
        avatar: [this.store.editedUser()?.avatar || ''],
        city: [this.store.editedUser()?.city || null, Validators.required],
        address: [this.store.editedUser()?.address || '', Validators.required],
    });

    readonly cities = cities;
    filteredCities$: Observable<string[]> = this.form.get('city')!.valueChanges.pipe(
        startWith(this.form.controls.city.value),
        map((value: string | null) => {
            const name = typeof value === 'string' ? value : '';
            return name ? filterCitiesByName(name, this.cities) : this.cities.slice();
        }),
        takeUntilDestroyed()
    );

    readonly UserRole = UserRole;

    constructor() {}

    onSubmit() {
        let user = this.form.value as UserProfile;
        if (this.store.editedUser()) {
            user = { ...this.store.editedUser(), ...user };
            this.store.updateEditedUser(user);
        } else {
            this.store.createNewUser(user);
            this.router.navigate(['/user/list']);
        }
    }

    onCancel() {
        if (this.store.editedUser()) {
            this.store.setEditedUser(null);
        } else {
            this.router.navigate(['/user/list']);
        }
    }

    onDeleteUser(user: UserProfile): void {
        this.store.deleteUser(user);
    }
}

interface UserProfileForm {
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    nickName: FormControl<string | null>;
    email: FormControl<string | null>;
    mobilePhone: FormControl<string | null>;
    avatar: FormControl<string | null>;
    city: FormControl<string | null>;
    address: FormControl<string | null>;
}
