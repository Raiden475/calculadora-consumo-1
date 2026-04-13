export interface Load {
    km: number;
    liters: number;
}

export interface Trip {
    initKm: number | null;
    loads: Load[];
}

export interface CalcResult {
    totalDistance: number;
    totalLiters: number;
    averageConsumption: number;
}