export interface SearchModel {
    search: string;
    column: string;
    minPrice?: number;
    maxPrice?: number;
    isRented: boolean;
    isNotRented: boolean;
}