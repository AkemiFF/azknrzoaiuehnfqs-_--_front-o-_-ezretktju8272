import Head from "next/head";
import { useRouter } from "next/router";
import style from './../../../style/pages/responsable/accommodation/room.module.css'
import { Button } from "primereact/button";
import { useState, useEffect, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ResponsableLayoutContext from "@/layouts/context/responsableLayoutContext";
import { getCsrfTokenDirect } from '@/util/csrf';
import UrlConfig from "@/util/config";

export default function Guest() {
    const router = useRouter();
    const { user } = useContext(ResponsableLayoutContext);
    const [name_hotel, setName_hotel] = useState(null);
    const [guests, setGuests] = useState([]);
    const [id, setId] = useState();

    useEffect(() => {
        user ? setId(user.id_etablissement) : 0;

        if (id) {
            FetchGuest(id);
        }

    }, [id, user]);

    function FetchGuest(id) {
        getCsrfTokenDirect()
            .then(csrfToken => {
                // Fetch Hotel Name
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
                    .catch(err => console.error('Error fetching hotel name:', err));

                // Fetch List of Guests
                fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/clients-et-chambres/${id}/`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFTOKEN': csrfToken,
                    }
                })
                    .then(response => response.json())
                    .then(guestsData => {
                        setGuests(guestsData);
                    })
                    .catch(err => console.error('Error fetching guests:', err));

            })
            .catch(err => console.error('Error fetching CSRF token:', err));
    }



    const buttonTemplate = (item) => {
        return (
            <>
                <Button onClick={() => router.push("/responsable/accommodation/guest/" + item.client_reserve.id)} icon="pi pi-eye" text />
            </>
        )
    }

    return (
        <>
            <Head>
                <title>Guest</title>
            </Head>

            <div className={style.top_container}>
                <div className={style.top_container_title_container}>
                    <span className={style.top_container_title}>Lists Guest</span>
                    <span className={style.top_container_subtitle}>{name_hotel?.nom_hebergement || 'No Hotel Name'}</span>
                </div>
                <Button onClick={() => router.push("/responsable/accommodation/guest")} label="+ Add new guest" className={style.button_add} />
            </div>

            <div className={style.container}>
                <span className={style.container_title}>All guests</span>
                <div className={style.table_container}>
                    <DataTable paginator rows={10} value={guests}>
                        <Column sortable field="client_reserve.username" header="Name" />
                        <Column sortable field="client_reserve.email" header="Email" />
                        <Column sortable field="nombre_personnes_reserve" header="No. Guest" />
                        <Column sortable field="chambre_reserve.nom_chambre" header="Room" />
                        <Column sortable field="date_debut_reserve" header="Check in" />
                        <Column sortable field="date_fin_reserve" header="Check out" />
                        <Column body={buttonTemplate} />
                    </DataTable>
                </div>
            </div>
        </>
    )
}
