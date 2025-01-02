export interface IStats {
    averageDailyRevenue: number;
    leastOrderedDish: string;
    mostOrderedDish: string;
    dailyRevenues: {
        day: string;
        value: number;
    }[];
    monthlyRevenues: {
        month: string;
        value: number;
    }[];
}
