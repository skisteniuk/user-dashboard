import { UserRole } from '../../../shared/types/user-roles';

export class UserProfile {
    public id: string = '';
    public role: UserRole | null = null;
    public firstName: string = '';
    public lastName: string = '';
    public nickName?: string = '';
    public avatar: string = '';
    public mobilePhone: string = '';
    public email: string = '';
    public city: string = '';
    public address: string = '';
    public apartment?: string = '';
}
