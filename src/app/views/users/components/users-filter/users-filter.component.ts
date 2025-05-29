import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-users-filter',
    imports: [],
    templateUrl: './users-filter.component.html',
    styleUrl: './users-filter.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersFilterComponent {}
