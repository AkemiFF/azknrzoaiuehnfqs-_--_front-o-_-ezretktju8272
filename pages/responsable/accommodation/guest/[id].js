import Head from "next/head";
import { useRouter } from "next/router";
import style from './../../../../style/pages/responsable/accommodation/guest/id.module.css';
import Link from "next/link";
import { Image } from "primereact/image";
import { Button } from "primereact/button";
import { useEffect, useState, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ResponsableLayoutContext from "@/layouts/context/responsableLayoutContext";
import { getCsrfFromToken } from '@/util/csrf';
import UrlConfig from "@/util/config";

export default function DetailGuest() {
    const router = useRouter();
    const [guests, setGuests] = useState(null);
    const [nameHotel, setNameHotel] = useState(null); 
    const [bookingSummary, setBookingSummary] = useState({});
    const [bookingHistory, setBookingHistory] = useState([]);
    const { user } = useContext(ResponsableLayoutContext);
    const { id } = router.query;

    useEffect(() => {
        if (user && id) {
            const id_hebergement = user.id_etablissement;
            FetchDetails_Guest(id_hebergement, id);
        }
    }, [user, id]);

    function FetchDetails_Guest(id_hebergement, id) {
        getCsrfFromToken()
            .then(csrfToken => {
                // Fetch hotel details
                fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/get-id-hebergement/${id_hebergement}/`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFTOKEN': csrfToken,
                    }
                })
                    .then(response => response.json())
                    .then(hotelData => {
                        setNameHotel(hotelData);
                    })
                    .catch(err => console.error('Erreur lors de la récupération du nom de l\'hôtel:', err));
                    
                // Fetch guest details
                fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/client-reservations/${id}/hebergement/${id_hebergement}/`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFTOKEN': csrfToken,
                    }
                })
                    .then(response => response.json())
                    .then(guestData => {
                        setGuests(guestData);
                        setBookingSummary(guestData.reservations[0]);
                        setBookingHistory(
                            guestData.reservations.map(res => ({
                                id: res.client.id || 'N/A',
                                name: res.client.nom || 'N/A',
                                email: res.client.email || 'N/A',
                                nbr_guest: res.nombre_personnes_reserve || 'N/A',
                                room: res.chambre.nom || 'N/A',
                                check_in: res.date_debut_reserve || 'N/A',
                                check_out: res.date_fin_reserve || 'N/A'
                            }))
                        );
                    })
                    .catch(err => console.error('Erreur lors de la récupération des Clients de l\'hôtel:', err));
            })
            .catch(err => console.error('Erreur lors de la récupération du token CSRF:', err));   
    }

      // Get the first image URL from the guests data
    const firstImageUrl = guests?.reservations?.[0]?.chambre?.images?.[0]?.url;
    console.log(firstImageUrl); // Log the images


    return (
        <>
            <Head>
                <title>Detail Guest</title>
            </Head>

            <div className={style.top_container}>
                <div className={style.top_container_title_container}>
                    <span className={style.top_container_title}>Guest</span>
                    <span className={style.top_container_subtitle}>{nameHotel?.nom_hebergement || 'No Hotel Name'}</span>
                </div>
            </div>

            <div className={style.container}>
                <Link className={style.container_title_link} href={"/responsable/accommodation/guest"}>
                    <i className="pi pi-arrow-left" />
                    <span>Back</span>
                </Link>
                <div className={style.card_container}>
                    <div className={style.guest_information_container}>
                        <div className={style.guest_information_left_container}>
                            <div className={style.image_guest_container}>
                                 {firstImageUrl ? (
                                    <Image 
                                        src={UrlConfig.apiBaseUrl+firstImageUrl} 
                                        alt="Chambre" 
                                        imageClassName={style.image_guest_room}
                                        onError={(e) => e.currentTarget.src = '/images/hotel/chambre.jpg'}
                                    />
                                ) : (
                                    <Image 
                                        src="/images/hotel/chambre.jpg" 
                                        alt="Chambre" 
                                        imageClassName={style.image_guest_room}
                                    />
                                )}
                                <Button onClick={() => router.push("/responsable/accommodation/room")} raised label="See all rooms" className="button-secondary" />
                                <Button onClick={() => router.push("/responsable/accommodation/guest")} raised label="See all guests" className="button-secondary" />
                            </div>
                            <div className={style.guest_information}>
                                <div className={style.user_container}>
                                    <span className={style.username}>{guests?.reservations?.[0]?.client?.nom || 'No Client Name'}</span>
                                    <span className={style.user_id}>ID: {guests?.reservations?.[0]?.client?.id || 'No Client ID'}</span>
                                </div>

                                <div className={style.guest}>
                                    <div className={style.guest_detail_container}>
                                        <div className={style.guest_detail}>
                                            <span className={style.guest_detail_title}>Check-in</span>
                                            <span className={style.guest_detail_value}>{guests?.reservations?.[0]?.date_debut_reserve || 'No Check-in'}</span>
                                        </div>
                                        <div className={style.guest_detail}>
                                            <span className={style.guest_detail_title}>No. Guest</span>
                                            <span className={style.guest_detail_value}>{guests?.reservations?.[0]?.nombre_personnes_reserve || 'No Guest number'}</span>
                                        </div>
                                        <div className={style.guest_detail}>
                                            <span className={style.guest_detail_title}>Room name</span>
                                            <span className={style.guest_detail_value}>{guests?.reservations?.[0]?.chambre.nom }</span>
                                        </div>
                                    </div>
                                    <div className={style.guest_detail_container}>
                                        <div className={style.guest_detail}>
                                            <span className={style.guest_detail_title}>Check-out</span>
                                            <span className={style.guest_detail_value}>{guests?.reservations?.[0]?.date_fin_reserve || 'No Check-out'}</span>
                                        </div>
                                        <div className={style.guest_detail}>
                                            <span className={style.guest_detail_title}>Guest request</span>
                                            <span className={style.guest_detail_value}>{guests?.reservations?.[0]?.nombre_personnes_reserve || 'No Guest number'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={style.guest_information_right_container}>
                            <span className={style.guest_information_right_title}>Booking summary</span>
                            <div className={style.guest_information_right}>
                                <span className={style.guest_information_right_label}>
                                    <i className="pi pi-clock" />
                                    Period
                                </span>
                                <span className={style.guest_information_right_value}>{bookingSummary?.nombre_de_nuits || 'No number nights'} nights</span>
                            </div>
                            <div className={style.guest_information_right}>
                                <span className={style.guest_information_right_label}>
                                    <i className="pi pi-user" />
                                    Guest
                                </span>
                                <span className={style.guest_information_right_value}>{bookingSummary?.nombre_personnes_reserve || 'No Guest number'}</span>
                            </div>
                            <div className={style.guest_information_right}>
                                <span className={style.guest_information_right_label}>
                                    <i className="pi pi-wallet" />
                                    Price
                                </span>
                                <span className={style.guest_information_right_value}>$ {bookingSummary?.chambre?.prix_par_nuit || 'No price'} / night</span>
                            </div>
                            <div className={style.guest_information_right}>
                                <span className={style.guest_information_right_label}>
                                    <i className="pi pi-ticket" />
                                    Discount
                                </span>
                                <span className={style.guest_information_right_value}>0</span>
                            </div>
                            <div className={style.separateur}></div>
                            
                            <div className={style.guest_information_right}>
                                <span className={style.guest_information_right_label}>
                                    Total
                                </span>
                                <span className={style.guest_information_right_value_active}>$ {bookingSummary?.prix_total_reserve || 'No price'}</span>
                            </div>
                        </div>
                    </div>
                    <div className={style.separateur}></div>
                    <h2>Booking history</h2>
                    <DataTable value={bookingHistory}>
                        <Column sortable field="id" header="No"/>
                        <Column sortable field="name" header="Name"/>
                        <Column sortable field="email" header="Email"/>
                        <Column sortable field="nbr_guest" header="Nbr guest"/>
                        <Column sortable field="room" header="Room"/>
                        <Column sortable field="check_in" header="Check-in"/>
                        <Column sortable field="check_out" header="Check-out"/>
                    </DataTable>
                </div>
            </div>
        </>
    );
}
