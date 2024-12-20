import ResponsableLayoutContext from "@/layouts/context/responsableLayoutContext";
import style from '@/style/pages/responsable/tour/dashboard.module.css';
import BookingChartCard from "@/util/BookingChartCard";
import UrlConfig from "@/util/config";
import { getResponsableAccessToken } from "@/util/Cookies";
import totalBookingTour from "@/util/TotalBookingTour";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Chart } from "primereact/chart";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useContext, useEffect, useState } from "react";

export default function DashBoard() {

    const router = useRouter();
    const [barData, setBarData] = useState({});
    const [barOptions, setBarOptions] = useState({});

    const [lineData, setLineData] = useState({});
    const [lineOptions, setLineOptions] = useState({});

    const [barHorizontalData, setBarHorizontalData] = useState({
        labels: [],
        datasets: []
    });


    const [recentBooking, setRecentBooking] = useState([
        { id: "#41", name: "Paul Adamas", room: "203", guests: "2", check_in: "07-07-2024", check_out: "08-07-2024" },
        { id: "#41", name: "Paul Adamas", room: "203", guests: "2", check_in: "07-07-2024", check_out: "08-07-2024" },
        { id: "#41", name: "Paul Adamas", room: "203", guests: "2", check_in: "07-07-2024", check_out: "08-07-2024" },
        { id: "#41", name: "Paul Adamas", room: "203", guests: "2", check_in: "07-07-2024", check_out: "08-07-2024" },
        { id: "#41", name: "Paul Adamas", room: "203", guests: "2", check_in: "07-07-2024", check_out: "08-07-2024" }
    ])
    useEffect(() => {
        const data = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: "New travel",
                    backgroundColor: "#D4E4E2",
                    borderColor: "#D4E4E2",
                    data: [40, 88, 60, 87, 36, 36, 30]
                },
                {
                    label: "Confirmed travel",
                    backgroundColor: "#305555",
                    borderColor: "#305555",
                    data: [43, 44, 74, 52, 29, 96, 24]
                }
            ]
        };
        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
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

        setBarData(data);
        setBarOptions(options);


        const dataHorizontal = {

            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: "Booking",
                    backgroundColor: "#D4E4E2",
                    borderColor: "#D4E4E2",
                    data: [40, 88, 60, 87, 36, 36, 30]
                }
            ]
        };
        const optionsHorizontal = {
            indexAxis: 'y',
            maintainAspectRatio: false,
            aspectRatio: 0.5,
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
        setBarHorizontalData(dataHorizontal);


        const dataLine = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: "New travel",
                    backgroundColor: "rgba(48, 85, 85,0.2)",
                    borderColor: "#305555",
                    data: [40, 88, 60, 87, 36, 36, 30],
                    tension: 0.4,
                    fill: true
                }
            ]
        };
        const optionsLine = {
            maintainAspectRatio: false,
            aspectRatio: 1.9,
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
        setLineData(dataLine);
        setLineOptions(optionsLine);
    }, [])


    // 
    const { user } = useContext(ResponsableLayoutContext);
    const [totalStat, setTotalStat] = useState(0);

    useEffect(() => {
        if (user) {
            const id_tour = user.id_etablissement;
            FetchDetails_Guest(id_tour);
        }
    }, [user]);

    function FetchDetails_Guest(id_tour) {

        // Fetch hotel details
        fetch(`${UrlConfig.apiBaseUrl}/api/tour/${id_tour}/stats/`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(totalData => {
                setTotalStat(totalData);
            })
            .catch(err => console.error('Erreur lors de la récupération du nom de l\'hôtel:', err));

    }


    return (
        <>
            <Head>
                <title>Dashboard - Tour</title>
            </Head>

            <div className={style.top_container}>
                <div className={style.top_container_title_container}>
                    <span className={style.top_container_title}>Dashboard</span>
                    <span className={style.top_container_subtitle}>Tour de voyage</span>
                </div>
                <Button onClick={() => router.push("/responsable/tour/addTrip")} label="+ Add new travel" className={style.button_add} />
            </div>


            <div className={style.container}>
                <div className={style.left_container}>
                    <div className={style.card_detail_container}>
                        <div className={style.card_detail}>
                            <i className="pi pi-calendar" style={{ fontSize: "32px" }} />
                            <div className={style.card_detail_text}>
                                <span className={style.card_detail_title}>Total Trip</span>
                                <span className={style.card_detail_value}>{totalStat?.voyage_count}</span>
                            </div>
                        </div>
                        <div className={style.card_detail}>
                            <i className="pi pi-calendar" style={{ fontSize: "32px" }} />
                            <div className={style.card_detail_text}>
                                <span className={style.card_detail_title}>Total tour de voyage</span>
                                <span className={style.card_detail_value}>{totalStat?.booking_count}</span>
                            </div>
                        </div>
                        <div className={style.card_detail}>
                            <i className="pi pi-calendar" style={{ fontSize: "32px" }} />
                            <div className={style.card_detail_text}>
                                <span className={style.card_detail_title}>Total guests</span>
                                <span className={style.card_detail_value}>{totalStat?.total_guests}</span>
                            </div>
                        </div>
                    </div>

                    <span>All travels</span>

                    <div className={style.detail_dashboard}>
                        <span className={style.detail_dashboard_title}>Tour state</span>
                        <div className={style.card}>
                            <Chart type="bar" data={barData} options={barOptions} />
                        </div>
                    </div>

                    <div className={style.detail_dashboard}>
                        <span className={style.detail_dashboard_title}>Recent tour</span>
                        <div className={style.card}>
                            <DataTable value={recentBooking}>
                                <Column sortable field="id" header="No" />
                                <Column sortable field="name" header="Name" />
                                <Column sortable field="room" header="Room" />
                                <Column sortable field="guests" header="Guests" />
                                <Column sortable field="check_in" header="Check in" />
                                <Column sortable field="check_out" header="Check out" />
                            </DataTable>
                        </div>
                    </div>
                </div>
                <div className={style.right_container}>
                    <Calendar inline showWeek />
                    <div className={style.card}>
                        <BookingChartCard />
                    </div>
                    <div className={style.card}>
                        <Chart type="line" data={lineData} options={lineOptions} />
                    </div>
                </div>
            </div>


        </>
    )
}