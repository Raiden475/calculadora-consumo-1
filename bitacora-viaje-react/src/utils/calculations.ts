import type { Trip, CalcResult } from '../models/types'

export const calculateStatics = (trip: Trip): CalcResult | null => {
    if (trip.loads.length === 0 || trip.initKm === null) {
        return null
    }

    const totalLiters = trip.loads.reduce((acc, load) => acc + load.liters, 0);
    const finalKm = trip.loads[trip.loads.length - 1].km;
    const totalDistance = finalKm - trip.initKm;

    if (totalDistance <= 0) return null;

    const averageConsumption = (totalLiters / totalDistance) * 100;

    return {
        totalDistance,
        totalLiters,
        averageConsumption
    }
}