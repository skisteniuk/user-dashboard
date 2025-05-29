export enum UserRole {
    Admin = 'Admin',
    Operator = 'Operator',
    Guest = 'Guest',
}

export function getRandomUserRole(): UserRole {
    const roles = Object.values(UserRole);
    const randomIndex = Math.floor(Math.random() * roles.length);
    return roles[randomIndex];
}

export const UserRoleDisplayNames: { [key in string]: string } = {
    Admin: 'Адміністратор',
    Operator: 'Оператор',
    Guest: 'Гість',
};
