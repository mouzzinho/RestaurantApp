import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

import styles from './chart.module.scss';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface IChartProps {
    className?: string;
    type: 'days' | 'months';
    data: { labels: string[]; values: number[] };
}

const Chart: React.FC<IChartProps> = ({ className = '', type, data }) => {
    const localData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Przychody w zł',
                data: data.values,
                backgroundColor: generateColor(data.values.length),
            },
        ],
    };

    return <Bar className={`${className} ${styles.container}`} options={getOptions(type)} data={localData} />;
};

function getOptions(type: 'days' | 'months') {
    return {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: type === 'days' ? 'Przychody w przeciągu ostatnich 30 dni' : 'Przychody w przeciągu ostatnich 12 miesięcy',
            },
        },
    };
}

function generateColor(count: number) {
    return Array.from(
        { length: count },
        () => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
    );
}

export default Chart;
