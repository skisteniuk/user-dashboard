import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, map, throwError } from 'rxjs';
import { Credentials } from './types/credentials';
import { UserProfile } from '../users/types/user-profile';
import { UserRole } from '../../shared/types/user-roles';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    url = 'http://localhost:3000/users'; // Base URL for authentication API endpoints

    constructor(private http: HttpClient) {}

    login(credentials: Credentials) {
        const url = `${this.url}?email=${credentials.email}&password=${credentials.password}`;
        return this.http.get<UserProfile>(url).pipe(
            delay(1000), // Simulate network delay
            map((users: UserProfile | any) => {
                const user = users[0];
                if (user?.firstName && user?.lastName && user?.email) return user;
                else {
                    throw new Error('');
                }
            }),
            catchError((error) => {
                return throwError(() => new Error('Невірний пароль та адреса електронної пошти'));
            })
        );
    }

    isAuthorized(user: UserProfile | null, permittedRoles: UserRole[]): boolean {
        const userRole = user?.role as UserRole;
        if (userRole && permittedRoles?.length) {
            return permittedRoles.some(
                (permittedRole: UserRole) => permittedRole.toLocaleLowerCase() === userRole.toLocaleLowerCase()
            );
        }
        return false;
    }
}
