export const cities: string[] = ['Київ', 'Львів', 'Одеса', 'Харків', 'Дніпро', 'Рівне', 'Івано-Франківськ', 'Чернівці'];

export const filterCitiesByName = (filterValue: string, list: string[] = cities): string[] => {
    return list.filter((city) => city.toLowerCase().includes(filterValue.toLowerCase()));
};
