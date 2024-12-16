import Head from "next/head";
import style from './../../../style/pages/responsable/tour/trip.module.css';
import { Button } from "primereact/button";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import TourCard from "@/components/responsable/TourCard";
import { Dialog } from "primereact/dialog";
import { Avatar } from "primereact/avatar";
import { Image } from "primereact/image";
import ResponsableLayoutContext from "@/layouts/context/responsableLayoutContext";
import UrlConfig from "@/util/config";

export default function Trip() {
    const router = useRouter();
    const [category, setCategory] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [allVoyages, setAllVoyages] = useState([]);
    const { user } = useContext(ResponsableLayoutContext);
    const [totalTravelers, setTotalTravelers] = useState(0); 

    const [visible, setVisible] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedVoyage, setSelectedVoyage] = useState(null); // To store selected voyage details

    useEffect(() => {
        if (user) {
            const id_tour = user.id_etablissement;
            fetch(`${UrlConfig.apiBaseUrl}/api/tour/${id_tour}/list-voyages/`)
                .then(res => res.json())
                .then(data => {
                    setAllVoyages(data);
                    if (data.length > 0) {
                        const firstVoyage = data[0];
                        setBookings(firstVoyage.reservations || []);
                        setCategory(firstVoyage.id);
                        setSelectedVoyage(firstVoyage); // Set the details of the first voyage
                        calculateTotalTravelers(firstVoyage.reservations || []);
                    }
                })
                .catch(error => console.log(error));
        }
    }, [user]);

    const changeTrip = (voyageId) => {
        const selectedVoyage = allVoyages.find(v => v.id === voyageId);
        if (selectedVoyage) {
            setCategory(voyageId);
            setBookings(selectedVoyage.reservations || []);
            setSelectedVoyage(selectedVoyage);
            calculateTotalTravelers(selectedVoyage.reservations || []);
        }
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
                <title>Trip</title>
            </Head>

            <div className={style.top_container}>
                <div className={style.top_container_title_container}>
                    <span className={style.top_container_title}>Trip</span>
                    <span className={style.top_container_subtitle}>Carlton Hotel</span>
                </div>
                <Button onClick={() => router.push("/responsable/tour/addTrip")} label="+ Add new trip" className={style.button_add} />
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
                <div className={style.detail_container}>
                    {selectedVoyage && (
                        <>
                            <span className={style.title}>{selectedVoyage.nom_voyage}</span>
                            <div className={style.detail}>
                                <div className={style.image_container}>
                                    {selectedVoyage.images && selectedVoyage.images.length > 0 ? (
                                        selectedVoyage.images.map((img, index) => (
                                            <Image 
                                                key={index} 
                                                src={UrlConfig.apiBaseUrl + img.image} 
                                                alt={`Voyage Image ${index}`} 
                                                imageClassName={style.image} 
                                            />
                                        ))
                                    ) : (
                                        <Image 
                                            src='/images/artisanat/aucun_image.jpeg' 
                                            alt='Default Image' 
                                            imageClassName={style.image} 
                                        />
                                    )}
                                </div>
                                <Button icon="pi pi-pencil" label="Edit" className={style.button_modif} />
                            </div>
                            <div className="separateur"></div>
                            <div className={style.detail}>
                                <div className={style.detail_content}>
                                    <span className={style.title}>Trip information</span>
                                    <div className={style.wrapper}>
                                        <div className={style.detail_value}>
                                            <span>Name</span>
                                            <span className={style.value}>{selectedVoyage.nom_voyage}</span>
                                        </div>
                                        <div className={style.detail_value}>
                                            <span>Check-in</span>
                                            <span className={style.value}>{new Date(selectedVoyage.date_debut).toLocaleDateString()}</span>
                                        </div>
                                        <div className={style.detail_value}>
                                            <span>Check-out</span>
                                            <span className={style.value}>{new Date(selectedVoyage.date_fin).toLocaleDateString()}</span>
                                        </div>
                                        <div className={style.detail_value}>
                                            <span>Departure</span>
                                            <span className={style.value}>{selectedVoyage.ville_depart}</span>
                                        </div>
                                        <div className={style.detail_value}>
                                            <span>Destination</span>
                                            <span className={style.value}>{selectedVoyage.destination_voyage}</span>
                                        </div>
                                        <div className={style.detail_value}>
                                            <span>Distance</span>
                                            <span className={style.value}>{selectedVoyage.distance} km</span>
                                        </div>
                                        <div className={style.detail_value}>
                                            <span>Price per person</span>
                                            <span className={style.value}>${selectedVoyage.prix_voyage}</span>
                                        </div>
                                        <div className={style.detail_value}>
                                            <span>Total places</span>
                                            <span className={style.value}>{selectedVoyage.places_disponibles}</span>
                                        </div>
                                        <div className={style.detail_value}>
                                            <span>Available places</span>
                                            <span className={style.value}>{selectedVoyage.places_disponibles - totalTravelers}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button icon="pi pi-pencil" label="Edit" className={style.button_modif} />
                            </div>
                            <div className="separateur"></div>
                            <div className={style.detail}>
                                <div className={style.detail_content}>
                                    <span className={style.title}>Trip inclusion</span>
                                    <div className={style.detail_inclusion_container}>
                                        {selectedVoyage.inclusions.map((inclusion, index) => (
                                            <div key={index} className={style.detail_inclusion}>
                                                <span className={style.detail_inclusion_title}><i className="pi pi-check" /></span>
                                                <span>Inclusion {index + 1}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Button icon="pi pi-pencil" label="Edit" className={style.button_modif} />
                            </div>
                            <div className={"separateur"}></div>
                            <div className={style.detail}>
                                <div className={style.detail_content}>
                                    <span className={style.title}>Trip description</span>
                                    <textarea value={selectedVoyage.description_voyage} className={style.description} readOnly />
                                </div>
                                <Button icon="pi pi-pencil" label="Edit" className={style.button_modif} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
