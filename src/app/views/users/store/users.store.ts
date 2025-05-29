import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { UserProfile } from '../types/user-profile';
import { UserService } from '../services/user.service';
import { searchableColumns } from '../types/users-table-data';

type UsersState = {
    users: UserProfile[];
    isLoading: boolean;
    error: string | null;
    editedUser: UserProfile | null;
    usersFilterData: {
        filteredValue: string;
        searchableColumns: string[];
    };
};

const initialState: UsersState = {
    users: [],
    isLoading: false,
    error: null,
    editedUser: null,
    usersFilterData: {
        filteredValue: '',
        searchableColumns: [...searchableColumns],
    },
};

export const UsersStore = signalStore(
    {
        providedIn: 'root',
    },
    withState(initialState),
    withComputed(({ users, usersFilterData }) => ({
        usersCount: computed(() => users().length),
        filteredUsers: computed(() => {
            const allUsers = users();
            const filterData = usersFilterData();

            return UserService.filterUsers(allUsers, filterData.filteredValue, filterData.searchableColumns);
        }),
    })),
    withMethods((store, userService: UserService = inject(UserService)) => ({
        getAllUsers: rxMethod<void>(
            pipe(
                tap(() => patchState(store, { isLoading: true })),
                exhaustMap(() => {
                    return userService.getAllUsers().pipe(
                        tapResponse({
                            next: (users: UserProfile[]) => patchState(store, { users, isLoading: false }),
                            error: (error) => {
                                console.error('Error fetching users by query', error);
                                return patchState(store, { error: 'Error fetching users by query', isLoading: false });
                            },
                            finalize: () => patchState(store, { isLoading: false }),
                        })
                    );
                })
            )
        ),
        setFilteredValue(filteredValue: string): void {
            patchState(store, { usersFilterData: { ...store.usersFilterData(), filteredValue } });
        },
        setSearchedColumns(searchableColumns: string[]): void {
            patchState(store, { usersFilterData: { ...store.usersFilterData(), searchableColumns } });
        },
        setEditedUser(user: UserProfile | null): void {
            patchState(store, { editedUser: user });
        },
        updateEditedUser(updatedUser: UserProfile | null): void {
            if (updatedUser) {
                const users = store.users().map((u) => (u.id === updatedUser.id ? updatedUser : u));
                patchState(store, { users, editedUser: null });
            }
        },
        createNewUser(newUser: UserProfile | null): void {
            if (newUser) {
                const users = [...store.users(), newUser];
                patchState(store, { users, editedUser: null });
            }
        },
        deleteUser(deletedUser: UserProfile | null): void {
            if (deletedUser) {
                const users = store.users().filter((u) => u.id !== deletedUser.id);
                patchState(store, { users, editedUser: null });
            }
        },
    }))
);
