import ResponsableLayoutContext from "@/layouts/context/responsableLayoutContext";
import UrlConfig from "@/util/config";
import { getResponsableAccessToken } from "@/util/Cookies";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Chart } from "primereact/chart";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useContext, useEffect, useState } from "react";
import style from './../../../style/pages/responsable/accommodation/dahsboard.module.css';



export default function DashBoard() {

    const router = useRouter();
    const [barData, setBarData] = useState({});
    const [barOptions, setBarOptions] = useState({});

    const [barHorizontalData, setBarHorizontalData] = useState({});
    const [barHorizontalOptions, setBarHorizontalOptions] = useState({});

    const [lineData, setLineData] = useState({});
    const [lineOptions, setLineOptions] = useState({});

    const [recentBooking, setRecentBooking] = useState([
        // {id:"#41",name:"Paul Adamas",room:"203",guests:"2",check_in:"07-07-2024",check_out:"08-07-2024"},
        // {id:"#41",name:"Paul Adamas",room:"203",guests:"2",check_in:"07-07-2024",check_out:"08-07-2024"},
        // {id:"#41",name:"Paul Adamas",room:"203",guests:"2",check_in:"07-07-2024",check_out:"08-07-2024"},
        // {id:"#41",name:"Paul Adamas",room:"203",guests:"2",check_in:"07-07-2024",check_out:"08-07-2024"},
        // {id:"#41",name:"Paul Adamas",room:"203",guests:"2",check_in:"07-07-2024",check_out:"08-07-2024"}
    ])

    // Integration 
    const { user } = useContext(ResponsableLayoutContext);

    const [nameHotel, setNameHotel] = useState(null);
    const [totalBookings, setTotalBookings] = useState(0);
    const [totalGuest, setTotalGuest] = useState(0);
    const [totalRooms, setTotalRooms] = useState(0);
    useEffect(() => {
        const x = getResponsableAccessToken()
        console.log(x);
    }, []);
    useEffect(() => {
        if (user) {
            const id_hebergement = user.id_etablissement;

            // Mode debug
            // console.log('User:', user);
            // console.log('id_hebergement:', id_hebergement);

            FetchDashboard_Hotel(id_hebergement);
        }
    }, [user])

    function FetchDashboard_Hotel(id_hebergement) {

        fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/get-id-hebergement/${id_hebergement}/`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(hotelData => {
                setNameHotel(hotelData);
            })
            .catch(err => console.error('Erreur lors de la récupération du nom de l\'hôtel:', err));

        // Fetch Hotel Statistics
        fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/${id_hebergement}/stats/`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(Total => {
                setTotalBookings(Total);
                setTotalGuest(Total);
                setTotalRooms(Total);
            })
            .catch(err => console.error('Erreur lors de la récupération des statistiques de l\'hôtel:', err));


        // Fetch Recent Bookings
        fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/${id_hebergement}/recent-reservations/`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(RecentBooking => {
                setRecentBooking(
                    RecentBooking.recent_reservations.map(res => ({
                        id: res.client_reserve.id,
                        name: res.client_reserve.first_name + " " + res.client_reserve.last_name,
                        room: res.chambre_reserve,
                        guests: res.nombre_personnes_reserve,
                        check_in: res.date_debut_reserve,
                        check_out: res.date_fin_reserve
                    }))
                )

            })
            .catch(err => console.error('Erreur lors de la récupération des Booking recents:', err));

        // Fetch Reservations Par Jour
        fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/reservations-by-day/${id_hebergement}/`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(reservationData => {
                const reservations = reservationData.reservations_by_day;

                // Data for the chart, using the fetched data
                const data = {
                    labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
                    datasets: [
                        {
                            label: "States Booking reservations",
                            backgroundColor: "#305555",
                            borderColor: "#305555",
                            data: [
                                reservations.Lundi,
                                reservations.Mardi,
                                reservations.Mercredi,
                                reservations.Jeudi,
                                reservations.Vendredi,
                                reservations.Samedi,
                                reservations.Dimanche
                            ]
                        }
                    ]
                };

                // Options for the chart
                const options = {
                    maintainAspectRatio: false,
                    aspectRatio: 0.6,
                    plugins: {
                        legend: {
                            labels: {
                                color: "#000"
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
                const dataLine = {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [
                        {
                            label: "New booking",
                            backgroundColor: "rgba(48, 85, 85,0.2)",
                            borderColor: "#305555",
                            data: [
                                reservations.Lundi,
                                reservations.Mardi,
                                reservations.Mercredi,
                                reservations.Jeudi,
                                reservations.Vendredi,
                                reservations.Samedi,
                                reservations.Dimanche
                            ],

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

                setBarData(data);
                setBarOptions(options);
            })
            .catch(err => console.error('Erreur lors de la récupération des réservations par jour:', err));


        //Fetch Booking state par Mois
        // Fecth Booking State
        fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/${id_hebergement}/reservations/mois/`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                const allMonths = [
                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ];

                // Create an object to map reservations by month
                const reservationsByMonth = {};

                data.reservations_by_month.forEach(item => {
                    const month = new Date(item.month).toLocaleDateString('en-US', { month: 'short' });
                    reservationsByMonth[month] = item.total_reservations;
                });

                // Create an array of reservation data, using 0 if no data for the month
                const reservationsData = allMonths.map(month => reservationsByMonth[month] || 0);
                const dataHorizontal = {
                    labels: allMonths,
                    datasets: [
                        {
                            label: "Booking",
                            backgroundColor: "#D4E4E2",
                            borderColor: "#D4E4E2",
                            data: reservationsData
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
                setBarHorizontalOptions(optionsHorizontal);

            })

    }



    useEffect(() => {




    }, [])

    return (
        <>
            <Head>
                <title>Dashboard - Accommodation</title>
            </Head>

            <div className={style.top_container}>
                <div className={style.top_container_title_container}>
                    <span className={style.top_container_title}>Dashboard</span>
                    <span className={style.top_container_subtitle}>{nameHotel?.nom_hebergement || 'No Hotel Name'}</span>
                </div>
                <Button onClick={() => router.push("/responsable/accommodation/addNewRoom")} label="+ Add new room" className={style.button_add} />
            </div>


            <div className={style.container}>
                <div className={style.left_container}>
                    <div className={style.card_detail_container}>
                        <div className={style.card_detail}>
                            <i className="pi pi-calendar" style={{ fontSize: "32px" }} />
                            <div className={style.card_detail_text}>
                                <span className={style.card_detail_title}>Total booking</span>
                                <span className={style.card_detail_value}>{totalBookings.booking_count}</span>
                            </div>
                        </div>
                        <div className={style.card_detail}>
                            <i className="pi pi-calendar" style={{ fontSize: "32px" }} />
                            <div className={style.card_detail_text}>
                                <span className={style.card_detail_title}>Avaliable room</span>
                                <span className={style.card_detail_value}>{totalRooms.available_room_count}</span>
                            </div>
                        </div>
                        <div className={style.card_detail}>
                            <i className="pi pi-calendar" style={{ fontSize: "32px" }} />
                            <div className={style.card_detail_text}>
                                <span className={style.card_detail_title}>Total guests</span>
                                <span className={style.card_detail_value}>{totalGuest.total_guests}</span>
                            </div>
                        </div>
                    </div>

                    <div className={style.detail_dashboard}>
                        <span className={style.detail_dashboard_title}>Booking states</span>
                        <div className={style.card}>
                            <Chart type="bar" data={barData} options={barOptions} />
                        </div>
                    </div>

                    <div className={style.detail_dashboard}>
                        <span className={style.detail_dashboard_title}>Recent Bookings</span>
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
                        <Chart type="bar" data={barHorizontalData} options={barHorizontalOptions} />
                    </div>
                    <div className={style.card}>
                        <Chart type="line" data={lineData} options={lineOptions} />
                    </div>
                </div>
            </div>


        </>
    )
}