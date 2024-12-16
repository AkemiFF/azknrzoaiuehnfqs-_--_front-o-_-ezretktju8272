import Head from "next/head";
import style from './../../../style/pages/responsable/tour/booking.module.css';
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

    const [visible, setVisible] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

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

    const calculateTotalTravelers = (reservations) => {
        const total = reservations.reduce((sum, reservation) => sum + reservation.nombre_voyageurs, 0);
        setTotalTravelers(total);
    };

    const showCustomerDetails = (customer) => {
        setSelectedCustomer(customer);
        setVisible(true);
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
                    </div>
                    <span className={style.title_table}>All booking</span>
                    <DataTable value={bookings}>
                        <Column sortable field="client.id" header="No"/>
                        <Column sortable field="client.username" header="Name"/>
                        <Column sortable field="nombre_voyageurs" header="Travelers"/>
                        <Column sortable field="client.email" header="Email"/>
                        <Column sortable field="client.numero_client" header="Phone Number"/>
                        <Column 
                            header="Details" 
                            body={(rowData) => (
                                <Button label="View" onClick={() => showCustomerDetails(rowData.client)} />
                            )}
                        />
                    </DataTable>
                </div>
                <Dialog draggable={false} header="Customer details" visible={visible} onHide={() => setVisible(false)}>
                    {selectedCustomer && (
                        <div className={style.dialog_container}>
                            {/* <Avatar label={selectedCustomer.username.charAt(0).toUpperCase()} shape="circle" className={style.avatar_customer}/> */}
                            <div className={style.detail_customer_container}>
                                <div className={style.detail_customer}>
                                    <span className={style.title}>Personnal information</span>
                                    <div className={style.detail_container}>
                                        <div className={style.detail}>
                                            <span className={style.detail_title}>First name</span>
                                            <span className={style.detail_label}>{selectedCustomer.first_name}</span>
                                        </div>
                                        <div className={style.detail}>
                                            <span className={style.detail_title}>Last name</span>
                                            <span className={style.detail_label}>{selectedCustomer.last_name}</span>
                                        </div>
                                        <div className={style.detail}>
                                            <span className={style.detail_title}>Email address</span>
                                            <span className={style.detail_label}>{selectedCustomer.email}</span>
                                        </div>
                                        <div className={style.detail}>
                                            <span className={style.detail_title}>Phone number</span>
                                            <span className={style.detail_label}>{selectedCustomer.numero_client}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={style.detail_customer}>
                                    <span className={style.title}>Address</span>
                                    <div className={style.detail_container}>
                                        <div className={style.detail}>
                                            <span className={style.detail_title}>Ville</span>
                                            <span className={style.detail_label}>{selectedCustomer.ville}</span>
                                        </div>
                                        <div className={style.detail}>
                                            <span className={style.detail_title}>Address</span>
                                            <span className={style.detail_label}>{selectedCustomer.address}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Dialog>
            </div>
        </>
    );
}
