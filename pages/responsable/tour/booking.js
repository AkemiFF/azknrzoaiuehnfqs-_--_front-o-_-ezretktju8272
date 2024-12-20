import Head from "next/head";
import style from '@/style/pages/responsable/tour/booking.module.css';
import { Button } from "primereact/button";
import { useEffect, useState , useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useRouter } from "next/router";
import TourCard from "@/components/responsable/TourCard";
import ResponsableLayoutContext from "@/layouts/context/responsableLayoutContext";
import UrlConfig from "@/util/config";
import { Dialog } from "primereact/dialog";


export default function Booking() {
    const router = useRouter();
    const [category, setCategory] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [allVoyages, setAllVoyages] = useState([]);
    const { user } = useContext(ResponsableLayoutContext);
    const [totalTravelers, setTotalTravelers] = useState(0); 

    useEffect(() => {
        if (user) {
            const id_tour = user.id_etablissement;
            fetch(`${UrlConfig.apiBaseUrl}/api/tour/${id_tour}/voyages/`)
                .then(res => res.json())
                .then(data => {
                    setAllVoyages(data);
                    if (data.length > 0) {
                        const firstVoyage = data[0];
                        setBookings(firstVoyage.reservations || []);
                        setCategory(firstVoyage.id);
                        calculateTotalTravelers(firstVoyage.reservations || []);
                    }
                })
                .catch(error => console.log(error));
        }
    }, [user]);

    const changeTrip = (voyageId) => {
        setCategory(voyageId);
        const selectedVoyage = allVoyages.find(v => v.id === voyageId);
        const reservations = selectedVoyage?.reservations || [];
        setBookings(reservations);
        calculateTotalTravelers(reservations);
    };

    // Fonction pour calculer le total des voyageurs
    const calculateTotalTravelers = (reservations) => {
        const total = reservations.reduce((sum, reservation) => sum + reservation.nombre_voyageurs, 0);
        setTotalTravelers(total);
    };

    return (
        <>
            <Head>
                <title>Booking</title>
            </Head>

            <div className={style.top_container}>
                <div className={style.top_container_title_container}>
                    <span className={style.top_container_title}>Booking</span>
                    <span className={style.top_container_subtitle}>Carlton Hotel</span>
                </div>
                <Button onClick={() => router.push("/responsable/tour/addTrip")} label="+ Add new trip" className={style.button_add}/>
            </div>

            <div className={style.container}>
                <div className={style.category_container}>
                    {allVoyages.map((voyage) => (
                        <TourCard 
                            key={voyage.id} 
                            nom_voyage={voyage.nom_voyage} 
                            onClick={() => changeTrip(voyage.id)}
                            selected={category === voyage.id}
                        />
                    ))}
                </div>
                <div className={style.table_container}>
                    <div className={style.card_detail_container}>
                        <div className={style.card_detail}>
                            <i className="pi pi-calendar" style={{fontSize:"32px"}}/>
                            <div className={style.card_detail_text}>
                                <span className={style.card_detail_title}>Total booking</span>
                                <span className={style.card_detail_value}>{bookings.length}</span>
                            </div>
                        </div>
                        <div className={style.card_detail}>
                            <i className="pi pi-calendar" style={{fontSize:"32px"}}/>
                            <div className={style.card_detail_text}>
                                <span className={style.card_detail_title}>Total Travelers</span>
                                <span className={style.card_detail_value}>{totalTravelers}</span>
                            </div>
                        </div>
                        {/* Ajouter d'autres détails de carte si nécessaire */}
                    </div>
                    <span className={style.title_table}>All booking</span>
                    <DataTable value={bookings}>
                        <Column sortable field="client.id" header="No"/>
                        <Column sortable field="client.username" header="Name"/>
                        <Column sortable field="nombre_voyageurs" header="Travelers"/>
                        <Column sortable field="client.email" header="Email"/>
                        <Column sortable field="client.numero_client" header="Phone Number"/>
                    </DataTable>
                </div>
            </div>
        </>
    );
}