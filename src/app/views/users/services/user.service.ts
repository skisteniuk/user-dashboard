import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { catchError, delay, tap, throwError } from 'rxjs';
import { UserProfile } from '../types/user-profile';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    url = 'http://localhost:3000/users'; // Base URL for user-related API endpoints

    static filterUsers(users: UserProfile[], filteredValue: string, searchedColumns: string[]): UserProfile[] {
        if (!filteredValue) {
            return users;
        }

        const lowerCaseSearchTerm = filteredValue.toLowerCase();

        return users.filter((user) => {
            return searchedColumns.some((columnName: string) => {
                const fieldValue = user[columnName as keyof UserProfile];

                if (fieldValue !== null && fieldValue !== undefined) {
                    return String(fieldValue).toLowerCase().includes(lowerCaseSearchTerm);
                }
                return false;
            });
        });
    }

    constructor(private http: HttpClient, private router: Router) {}

    getAllUsers() {
        // Simulate an API call to fetch all users
        return this.http.get<UserProfile[]>(this.url).pipe(
            delay(1000), // Simulate network delay
            catchError((error) => {
                console.error('Error fetching all users', error);
                return throwError(() => new Error('Error fetching all users'));
            })
        );
    }

    getByQuery(query: string) {
        // Simulate an API call to fetch users based on a query
        return this.http.get<UserProfile[]>(`/api/users?query=${query}`).pipe(
            tap((users) => {
                // Handle the response, e.g., log or process users
                console.log('Fetched users:', users);
            }),
            catchError((error) => {
                console.error('Error fetching users', error);
                return throwError(() => new Error('Error fetching users'));
            })
        );
    }
    updateUser(user: UserProfile) {
        // Simulate an API call to update a user
        return this.http.put<UserProfile>(`/api/users/${user.id}`, user).pipe(
            tap((updatedUser) => {
                // Handle the response, e.g., log or process the updated user
                console.log('Updated user:', updatedUser);
            }),
            catchError((error) => {
                console.error('Error updating user', error);
                return throwError(() => new Error('Error updating user'));
            })
        );
    }
    deleteUser(id: string) {
        // Simulate an API call to delete a user
        return this.http.delete(`/api/users/${id}`).pipe(
            tap(() => {
                // Handle the response, e.g., log or process the deletion
                console.log(`Deleted user with ID: ${id}`);
            }),
            catchError((error) => {
                console.error('Error deleting user', error);
                return throwError(() => new Error('Error deleting user'));
            })
        );
    }
    createUser(user: UserProfile) {
        // Simulate an API call to create a new user
        return this.http.post<UserProfile>('/api/users', user).pipe(
            tap((newUser) => {
                // Handle the response, e.g., log or process the new user
                console.log('Created user:', newUser);
            }),
            catchError((error) => {
                console.error('Error creating user', error);
                return throwError(() => new Error('Error creating user'));
            })
        );
    }
}
