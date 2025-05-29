import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-standard-page',
    imports: [RouterOutlet],
    templateUrl: './standard-page.component.html',
    styleUrl: './standard-page.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StandardPageComponent {}
