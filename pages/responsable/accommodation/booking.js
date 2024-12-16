import Head from "next/head";
import style from '@/style/pages/responsable/accommodation/booking.module.css';
import { useState, useEffect, useContext } from "react";
import RoomPlanning from "@/components/Planning";
import UrlConfig from "@/util/config";
import ResponsableLayoutContext from "@/layouts/context/responsableLayoutContext";
import { getCsrfTokenDirect } from '@/util/csrf';

export default function Booking() {
    const [book, setBook] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [name_hotel, setName_hotel] = useState(null);
    const { user } = useContext(ResponsableLayoutContext);

    // const [id, setId] = useState();

    useEffect(() => {
        if (user) {
            const id = user.id_etablissement;
            Fetch(id);
        }
    }, [user]);

    function Fetch(id) {
        getCsrfTokenDirect()
            .then(csrfToken => {
                // Fetch booking data
                fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/reservations/${id}/`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFTOKEN': csrfToken,
                    }
                })
                    .then(response => response.json())
                    .then(bookingData => {
                        const mappedData = bookingData.map(item => ({
                            title: item.client_reserve.username || 'N/A',
                            nuit: item.nombre_nuits,
                            jour: item.nombre_jours,
                            start: item.date_debut_reserve || 'N/A',
                            end: item.date_fin_reserve || 'N/A',
                            nbRoom: item.nombre_chambre_reserve,
                            resourceId: item.chambre_reserve || 'N/A'
                        }));
                        setBook(mappedData);
                    })
                    .catch(err => console.error('Erreur lors de la récupération des données de réservation:', err));

                // Fetch room data
                fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/${id}/chambres/`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFTOKEN': csrfToken,
                    }
                })
                    .then(response => response.json())
                    .then(roomsData => {
                        const mappedRooms = roomsData.map(room => ({
                            id: room.id,
                            title: room.nom_chambre
                        }));
                        setRooms(mappedRooms);
                    })
                    .catch(err => console.error('Erreur lors de la récupération des données de chambres:', err));

                // Fetch hotel name
                fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/get-id-hebergement/${id}/`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFTOKEN': csrfToken,
                    }
                })
                    .then(response => response.json())
                    .then(hotelData => {
                        setName_hotel(hotelData);
                    })
                    .catch(err => console.error('Erreur lors de la récupération du nom de l\'hôtel:', err));
            })
            .catch(err => console.error('Erreur lors de la récupération du token CSRF:', err));
    }



    return (
        <>
            <Head>
                <title>Booking</title>
            </Head>
            <div className={style.top_container}>
                <div className={style.top_container_title_container}>
                    <span className={style.top_container_title}>Booking</span>
                    <span className={style.top_container_subtitle}>{name_hotel?.nom_hebergement || 'No Hotel Name'}</span>
                </div>
            </div>

            <div className={style.container}>
                <RoomPlanning events={book} rooms={rooms} />
            </div>
        </>
    );
}
