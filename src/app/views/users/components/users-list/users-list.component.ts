import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    effect,
    inject,
    input,
    model,
    ViewChild,
} from '@angular/core';
import { UserProfile } from '../../types/user-profile';
import { MatFormFieldModule, MatSuffix } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { UserRole, UserRoleDisplayNames } from '../../../../shared/types/user-roles';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UsersStore } from '../../store/users.store';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthStore } from '../../../auth/store/auth.store';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { searchableColumns, columnDisplayNames } from '../../types/users-table-data';
import { MatTooltipModule } from '@angular/material/tooltip';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { robotoRegularBase64 } from '../../../../../assets/fonts/roboto-regular';
import { robotoBoldBase64 } from '../../../../../assets/fonts/roboto-bold';

@Component({
    selector: 'app-users-list',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatPaginator,
        MatPaginatorModule,
        MatSort,
        MatSortModule,
        MatTableModule,
        MatIconButton,
        MatIconModule,
        MatButtonModule,
        MatOptionModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatTooltipModule,
    ],
    templateUrl: './users-list.component.html',
    styleUrl: './users-list.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent implements AfterViewInit {
    users = input.required<UserProfile[]>();
    isLoading = input<boolean>();
    editedUser = model<UserProfile | null>();

    private readonly store = inject(UsersStore);
    private readonly router = inject(Router);
    public readonly authStore = inject(AuthStore);

    @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
    @ViewChild(MatSort) sort: MatSort | null = null;

    displayedColumns: string[] = [...searchableColumns, 'actions'];
    searchableColumns = searchableColumns;
    columnDisplayNames = columnDisplayNames;
    dataSource: MatTableDataSource<UserProfile> = new MatTableDataSource<UserProfile>([]);
    searchableColumnsCtrl = new FormControl(this.store.usersFilterData.searchableColumns() || this.searchableColumns);
    filteredValueCtrl = new FormControl(this.store.usersFilterData.filteredValue() || '');
    destroyRef = inject(DestroyRef);
    readonly UserRole = UserRole;
    readonly UserRoleDisplayNames = UserRoleDisplayNames;

    constructor() {
        // effect is still in Developer preview in v19
        effect(() => {
            this.dataSource.data = this.users() || [];
        });

        this.initializeSearchableColumnsControl();
        this.initializeFilteredValueControl();
    }

    initializeSearchableColumnsControl() {
        this.searchableColumnsCtrl.valueChanges
            .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
            .subscribe((searchableColumns: string[] | null) => {
                this.store.setSearchedColumns(searchableColumns || []);
            });
    }

    initializeFilteredValueControl() {
        this.filteredValueCtrl.valueChanges
            .pipe(
                debounceTime(100),
                distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
                takeUntilDestroyed()
            )
            .subscribe((filteredValue: string | null) => {
                this.store.setFilteredValue(filteredValue || '');
            });
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    onEditUser(user: UserProfile): void {
        this.store.setEditedUser(user);
    }

    onAddUser(): void {
        this.router.navigate(['/user/new']);
    }

    onDeleteUser(event: MouseEvent, user: UserProfile): void {
        this.store.deleteUser(user);
        event.stopPropagation(); // Prevent row click
    }

    onDonwloadInPDF(): void {
        const doc: jsPDF = new jsPDF('landscape', 'pt', 'a4');

        // Додаємо шрифт Roboto
        doc.addFileToVFS('Roboto-Regular.ttf', robotoRegularBase64.split('base64,')[1]);
        doc.addFileToVFS('Roboto-Bold.ttf', robotoBoldBase64.split('base64,')[1]);
        doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
        doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
        doc.setFont('Roboto', 'normal');

        // Заголовок
        doc.setFontSize(16);
        doc.text('Список користувачів', 40, 30, { align: 'left' });

        // Колонки без 'actions'
        const tableHeaders = this.displayedColumns
            .filter((col) => col !== 'actions')
            .map((col) => this.columnDisplayNames[col] || col);

        // Дані таблиці
        const tableData = this.dataSource.data.map((user) => [
            user.firstName || '',
            user.lastName || '',
            user.nickName || '',
            user.avatar || '',
            user.email || '',
            user.mobilePhone || '',
            user.city || '',
            user.address || '',
            user.role || '',
        ]);

        // Генерація таблиці
        autoTable(doc, {
            head: [tableHeaders],
            body: tableData,
            startY: 50,
            theme: 'grid',
            headStyles: {
                fillColor: [33, 150, 243],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                halign: 'center',
            },
            columnStyles: {
                0: { cellWidth: 50, halign: 'center' },
                1: { cellWidth: 80 },
                2: { cellWidth: 80 },
                3: { cellWidth: 80 },
                4: { cellWidth: 120 },
                5: { cellWidth: 80 },
                6: { cellWidth: 80 },
                7: { cellWidth: 120 },
                8: { cellWidth: 60, halign: 'center' },
            },
            styles: {
                font: 'Roboto',
                fontSize: 10,
                cellPadding: 4,
                overflow: 'linebreak',
                minCellHeight: 10,
            },
            margin: { top: 40, left: 40, right: 40, bottom: 40 },
            didDrawPage: (data) => {
                const pageCount = doc.getNumberOfPages();
                doc.setFontSize(10);
                doc.text(`Сторінка ${pageCount}`, 40, doc.internal.pageSize.height - 20);
            },
        });

        doc.save('users_list.pdf');
    }

    onPrint(): void {
        setTimeout(() => {
            // this.isPrinting = false;
            const tableElement = document.getElementById('users-table');
            if (tableElement) {
                const printData = tableElement.cloneNode(true);
                document.body.appendChild(printData);
                window.print();
                document.body.removeChild(printData);
            }
        }, 0);
    }
}
