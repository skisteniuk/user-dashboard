import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { AuthStore } from '../../store/auth.store';
import { Credentials } from '../../types/credentials';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
    selector: 'app-login',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        FormsModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
    readonly store = inject(AuthStore);
    readonly snackBar = inject(MatSnackBar);

    constructor(private router: Router) {
        // effect is still in Developer preview in v19
        effect(() => {
            const isAuthenticated = this.store.authenticated();
            if (isAuthenticated) {
                this.performRedirection();
            }

            const error = this.store.error();
            if (error) {
                this.snackBar.open(error, '', { duration: 3000 });
            }
        });
    }

    onLogin(credentials: Credentials) {
        this.store.login(credentials);
    }

    performRedirection() {
        this.router.navigate(['/user/list']);
    }
}
