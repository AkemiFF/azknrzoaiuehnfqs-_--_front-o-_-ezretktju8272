import Head from "next/head";

import style from './../../../style/pages/responsable/accommodation/room.module.css'
import { Button } from "primereact/button";
import { useContext, useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { confirmPopup, ConfirmPopup } from "primereact/confirmpopup";
import { useRouter } from "next/router";
import { UrlConfig } from "@/util/config";
import ResponsableLayoutContext from "@/layouts/context/responsableLayoutContext";
export default function Room() {

    const router = useRouter();
    const { user } = useContext(ResponsableLayoutContext);

    const [booking, setBooking] = useState()
    const [nameHotel, setNameHotel] = useState(null);
    const [id, setId] = useState();

    useEffect(() => {
        user ? setId(user.id_etablissement) : 0;


    }, [id, user]);
    useEffect(() => {
        if (id) {
            fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/${id}/chambres/`)
                .then(res => res.json())
                .then(data => {
                    setBooking(data)
                    // console.log(data)
                })
                .catch(error => console.error("Error fetching data:", error));

            fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/get-id-hebergement/${id}/`)
                .then(res => res.json())
                .then(data => {
                    setNameHotel(data)
                })
                .catch(error => console.error("Error fetching data:", error));
        }
    }, [id]);

    const buttonTemplate = (item) => {
        return (
            <>
                <Button icon="pi pi-pen-to-square" onClick={(e) => router.push(`/responsable/accommodation/room-edit/${item.id}`)} text severity="success" />
                <Button onClick={(e) => confirm(e, item.id)} icon="pi pi-trash" text severity="danger" />
            </>
        );
    }
    const deleteRoom = (id_chambre) => {
        fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/delete-hebergement-chambre/${id_chambre}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${user.token}`
            }
        })
            .then(response => {
                if (response.ok) {
                    setBooking(booking.filter(room => room.id !== id_chambre));
                }
            })
            .catch(error => console.error('Error deleting room:', error));
    }
    const confirm = (event, id_chambre) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Do you want to delete this item?',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: () => deleteRoom(id_chambre)
        });
    };

    const availableTemplate = (item) => {
        // console.log(item);
        if (item.disponible_chambre >= 1) {
            return (
                <>
                    <span><i className="pi pi-check" /> available</span>
                </>
            )
        }
        else {
            return (
                <>
                    <span><i className="pi pi-times" /> Not available</span>
                </>
            )
        }
    }

    const accept = () => {

    }

    return (
        <>
            <Head>
                <title>Room</title>
            </Head>

            <div className={style.top_container}>
                <div className={style.top_container_title_container}>
                    <span className={style.top_container_title}>Room</span>
                    <span className={style.top_container_subtitle}>{nameHotel?.nom_hebergement || 'No Hotel Name'}</span>
                </div>
                <Button onClick={() => router.push("/responsable/accommodation/addNewRoom")} label="+ Add new room" className={style.button_add} />
            </div>

            <div className={style.container}>
                <span className={style.container_title}>All room</span>
                <div className={style.table_container}>
                    <DataTable paginator rows={10} value={booking}>
                        <Column sortable field="id" header="No" />
                        <Column sortable field="nom_chambre" header="Name" />
                        <Column sortable field="capacite" header="Max Guests" />
                        <Column sortable field="chambre.type_chambre" header="Type" />
                        {/* <Column sortable body={availableTemplate} header="Status" /> */}
                        <Column sortable field="disponible_chambre" header="Nb Rooms" />
                        <Column sortable field="prix_nuit_chambre" header="Price" />
                        <Column header="Action" body={buttonTemplate} />
                    </DataTable>
                </div>
            </div>

            <ConfirmPopup />
        </>
    )
}