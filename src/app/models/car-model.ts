export interface CarModel {
    id?: number;
    brand: string;
    model: string;
    price: number;
    image?: string;
    isRented?: boolean;
    fuelType?: string;
}