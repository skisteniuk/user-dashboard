import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

import { Credentials } from '../types/credentials';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { UserProfile } from '../../users/types/user-profile';

type AuthState = {
    user: UserProfile | null;
    authenticated: boolean;
    isLoading: boolean;
    error: string | null;
};

const initialState: AuthState = {
    user: <UserProfile>{},
    authenticated: false,
    isLoading: false,
    error: null,
};

export const AuthStore = signalStore(
    {
        providedIn: 'root',
    },
    withState(initialState),
    withMethods((store, authService = inject(AuthService)) => ({
        login: rxMethod<Credentials>(
            pipe(
                tap(() => patchState(store, { isLoading: true })),
                switchMap((credentials: Credentials) => {
                    return authService.login(credentials).pipe(
                        tapResponse({
                            next: (user: UserProfile) =>
                                patchState(store, { user, isLoading: false, authenticated: true, error: null }),
                            error: (err: any) => {
                                patchState(store, { isLoading: false, error: err?.message || 'Login failed' });
                                console.error(err);
                            },
                        })
                    );
                })
            )
        ),
    }))
);
