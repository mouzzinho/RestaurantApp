import styles from './stats.module.scss';

import { useStats } from '@/hooks/use-stats';
import { IStats } from '@/models/stats';

import Loader from '@/components/atoms/loader';
import Chart from '@/components/molecules/chart';

const Stats = () => {
    const statsState = useStats();
    const stats = statsState.get.data;
    const daysData = getDaysData(stats);
    const monthsData = getMonthsData(stats);

    return (
        <div className={styles.container}>
            {!stats && <Loader />}
            {stats && (
                <>
                    <div className={styles.column}>
                        <p className={styles.label}>Średni przychód dzienny z ostatnich 30 dni</p>
                        <p className={styles.value}>{stats.averageDailyRevenue} zł</p>
                    </div>
                    <div className={styles.column}>
                        <p className={styles.label}>Najczęściej zamawiane danie z ostatnich 30 dni</p>
                        <p className={styles.value}>{stats.mostOrderedDish}</p>
                    </div>
                    <div className={styles.column}>
                        <p className={styles.label}>Najrzadziej zamawiane danie z ostatnich 30 dni</p>
                        <p className={styles.value}>{stats.leastOrderedDish}</p>
                    </div>
                    <Chart type={'days'} data={daysData} />
                    <Chart type={'months'} data={monthsData} />
                </>
            )}
        </div>
    );
};

function getDaysData(stats?: IStats) {
    const labels: string[] = [];
    const values: number[] = [];

    stats?.dailyRevenues.forEach((stat) => {
        labels.push(stat.day);
        values.push(stat.value);
    });

    return {
        labels: labels.reverse(),
        values: values.reverse(),
    };
}

function getMonthsData(stats?: IStats) {
    const labels: string[] = [];
    const values: number[] = [];

    stats?.monthlyRevenues.forEach((stat) => {
        labels.push(stat.month);
        values.push(stat.value);
    });

    return {
        labels: labels.reverse(),
        values: values.reverse(),
    };
}

export default Stats;
