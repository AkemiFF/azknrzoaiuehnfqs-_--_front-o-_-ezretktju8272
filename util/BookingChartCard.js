import React, { useState, useEffect } from 'react';
import { Chart } from "primereact/chart";
import { Skeleton } from "primereact/skeleton";
import totalBookingTour from './TotalBookingTour';
import style from '@/style/pages/responsable/tour/dashboard.module.css';

const BookingChartCard = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });
    const [loading, setLoading] = useState(true);

    const chartOptions = {
        responsive: true,
        indexAxis: 'x',
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                labels: {
                    fontColor: "#000"
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: "#4a4a4a",
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    display: false,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: "#4a4a4a"
                },
                grid: {
                    display: false,
                    drawBorder: false
                }
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await totalBookingTour();
                setChartData(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const renderSkeleton = () => (
        <div className={style.skeletonContainer}>
            <Skeleton className={style.skeletonHeader} width="0%" height="2rem" />
            <div className={style.skeletonChart}>
                {[...Array(12)].map((_, index) => (
                    <div
                        key={index}
                        className={style.skeletonBar}
                        style={{ height: `${Math.random() * 80 + 20}%` }}
                    />
                ))}
                <div className={style.skeletonYAxis}>
                    {[1.0, 0.8, 0.6, 0.4, 0.2, 0].map((value, index) => (
                        <div key={index} className={style.skeletonYLabel}>
                            <Skeleton width="30px" height="12px" />
                            <span className={style.skeletonYLabelText}>{value.toFixed(1)}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className={style.skeletonXAxis}>
                {[...Array(12)].map((_, index) => (
                    <Skeleton key={index} className={style.skeletonXLabel} />
                ))}
            </div>
            <div className={style.skeletonLegend}>
                {[...Array(2)].map((_, index) => (
                    <div key={index} className={style.skeletonLegendItem}>
                        <Skeleton className={style.skeletonLegendColor} />
                        <Skeleton className={style.skeletonLegendLabel} />
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className={style.card}>
            {loading ? (
                renderSkeleton()
            ) : chartData && chartData.labels.length > 0 ? (
                <Chart type="bar" data={chartData} options={chartOptions} />
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
};

export default BookingChartCard;

