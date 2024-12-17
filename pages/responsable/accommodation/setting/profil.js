import SideBarMenu from "@/components/SideBarMenu";
import ResponsableLayoutContext from "@/layouts/context/responsableLayoutContext";
import UrlConfig from "@/util/config";
import { getResponsableAccessToken } from "@/util/Cookies";
import fetchHotelDetails from "@/util/HotelDetails";
import Head from "next/head";
import { useRouter } from "next/router";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Skeleton } from "primereact/skeleton";
import { useContext, useEffect, useState } from "react";
import style from './../../../../style/pages/responsable/accommodation/setting.module.css';
import style_profile from "./../../../../style/pages/responsable/accommodation/setting/profil.module.css";

export default function Profil() {
    const router = useRouter();
    const { user, setUser } = useContext(ResponsableLayoutContext);
    const { id } = router.query;

    const [nameHotel, setNameHotel] = useState(null);
    const [infosHotel, setInfosHotel] = useState(null);
    const [totalRooms, setTotalRooms] = useState(0);
    const [detailProfil, setDetailProfil] = useState(null);

    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [isEditingHotel, setIsEditingHotel] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function FetchProfil(id_hebergement, id_responsable) {
            setIsLoading(true);
            setError(null);
            const access = await getResponsableAccessToken();

            try {
                const hotelResponse = await fetchHotelDetails(user.id_etablissement);
                setNameHotel(hotelResponse);

                // Fetch Detail Responsable
                const responsableResponse = await fetch(`${UrlConfig.apiBaseUrl}/api/accounts/detail-responsable/${id_responsable}/`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access}`,
                    }
                });
                if (!responsableResponse.ok) throw new Error('Failed to fetch responsable details');
                const responsableData = await responsableResponse.json();
                setDetailProfil(responsableData);

                // Fetch Informations Hotels
                const infoResponse = await fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/info/${id_hebergement}/`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (!infoResponse.ok) throw new Error('Failed to fetch hotel information');
                const infoData = await infoResponse.json();
                setInfosHotel(infoData);

                // Fetch Total Rooms
                const roomsResponse = await fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/${id_hebergement}/stats/`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (!roomsResponse.ok) throw new Error('Failed to fetch room statistics');
                const roomsData = await roomsResponse.json();
                setTotalRooms(roomsData);

            } catch (err) {
                console.error('Error fetching profile data:', err);
                setError('Failed to load profile data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        }
        if (user) {
            const id_hebergement = user.id_etablissement;
            FetchProfil(id_hebergement, user.id);
        }
    }, [id, user]);

    function handleSave() {
        setIsLoading(true);
        setError(null);

        fetch(`${UrlConfig.apiBaseUrl}/api/accounts/detail-responsable/${user.id}/`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(detailProfil),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la mise à jour');
                }
                return response.json();
            })
            .then(data => {
                setUser({
                    ...user,
                    username: detailProfil.first_name
                });
                setIsEditingPersonal(false);
            })
            .catch(err => {
                console.error('Erreur lors de la mise à jour des informations personnelles:', err);
                setError('Failed to update personal information. Please try again.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    function handleSaveHotel() {
        setIsLoading(true);
        setError(null);
        fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/info/${user.id_etablissement}/`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(infosHotel),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setUser({
                    ...user,
                    nom_hebergement: infosHotel.nom_hebergement
                });
                setIsEditingHotel(false);
            })
            .catch(err => {
                console.error('Erreur lors de la mise à jour des informations de l\'hôtel:', err);
                setError('Failed to update hotel information. Please try again.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }
    const menu = 0;

    return (
        <>
            <Head>
                <title>Profil</title>
            </Head>

            <div className={style.container}>
                <SideBarMenu menu={menu} router={router} />
                <div className={style.right_body_container}>
                    <div className={style_profile.container}>
                        <div className={style_profile.user_title_container}>
                            <div className={style_profile.user_title_left}>
                                {isLoading ? (
                                    <Skeleton shape="circle" size="5rem" className={style_profile.user_avatar} />
                                ) : (
                                    <Avatar label={detailProfil?.first_name?.[0]} shape="circle" className={style_profile.user_avatar} />
                                )}
                                <div className={style_profile.user_title}>
                                    {isLoading ? (
                                        <>
                                            <Skeleton width="150px" className={style_profile.title} />
                                            <Skeleton width="100px" />
                                        </>
                                    ) : (
                                        <>
                                            <span className={style_profile.title}>{detailProfil?.first_name || 'No Name'}</span>
                                            <span>Manager</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Divider className={style_profile.divider} />
                        <div className={style_profile.detail_user_container}>
                            <div className={style_profile.detail_user_top_container}>
                                <span className={style_profile.title}>Personal information</span>
                                {isLoading ? (
                                    <Skeleton width="100px" height="36px" />
                                ) : isEditingPersonal ? (
                                    <>
                                        <Button
                                            text
                                            className={`${style_profile.button_edit} ${style_profile.button_save}`}
                                            icon="pi pi-save"
                                            raised
                                            label="Save"
                                            onClick={handleSave}
                                            disabled={isLoading}
                                        />
                                        <Button
                                            text
                                            className={style_profile.button_cancel}
                                            icon="pi pi-times"
                                            raised
                                            label="Cancel"
                                            onClick={() => setIsEditingPersonal(false)}
                                            disabled={isLoading}
                                        />
                                    </>
                                ) : (
                                    <Button
                                        text
                                        className={style_profile.button_edit}
                                        icon="pi pi-pencil"
                                        raised
                                        label="Edit"
                                        onClick={() => { setIsEditingPersonal(true); setIsEditingHotel(false); }}
                                        disabled={isLoading}
                                    />
                                )}
                            </div>
                            <div className={style_profile.detail_user_body_container}>
                                {['first_name', 'last_name', 'email', 'numero_responsable'].map((field) => (
                                    <div key={field} className={style_profile.detail_user}>
                                        <span className={style_profile.title}>{field.replace('_', ' ').charAt(0).toUpperCase() + field.replace('_', ' ').slice(1)}</span>
                                        {isLoading ? (
                                            <Skeleton width="200px" height="24px" />
                                        ) : isEditingPersonal && field !== 'email' ? (
                                            <input
                                                type="text"
                                                className={style_profile.input_edit}
                                                value={detailProfil?.[field] || ''}
                                                onChange={(e) => setDetailProfil({ ...detailProfil, [field]: e.target.value })}
                                            />
                                        ) : (
                                            <span>{detailProfil?.[field] || `No ${field.replace('_', ' ')}`}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Divider className={style_profile.divider} />
                        <div className={style_profile.detail_user_container}>
                            <div className={style_profile.detail_user_top_container}>
                                <span className={style_profile.title}>Hotel information</span>
                                {isLoading ? (
                                    <Skeleton width="100px" height="36px" />
                                ) : isEditingHotel ? (
                                    <>
                                        <Button
                                            text
                                            className={`${style_profile.button_edit} ${style_profile.button_save}`}
                                            icon="pi pi-save"
                                            raised
                                            label="Save"
                                            onClick={handleSaveHotel}
                                            disabled={isLoading}
                                        />
                                        <Button
                                            text
                                            className={style_profile.button_cancel}
                                            icon="pi pi-times"
                                            raised
                                            label="Cancel"
                                            onClick={() => setIsEditingHotel(false)}
                                            disabled={isLoading}
                                        />
                                    </>
                                ) : (
                                    <Button
                                        text
                                        className={style_profile.button_edit}
                                        icon="pi pi-pencil"
                                        raised
                                        label="Edit"
                                        onClick={() => { setIsEditingHotel(true); setIsEditingPersonal(false); }}
                                        disabled={isLoading}
                                    />
                                )}
                            </div>
                            <div className={style_profile.detail_user_body_container}>
                                {[
                                    { label: 'Hotel name', field: 'nom_hebergement' },
                                    { label: 'Address', field: 'localisation.adresse' },
                                    { label: 'City', field: 'localisation.ville' },
                                    { label: 'NIF', field: 'nif' },
                                    { label: 'STAT', field: 'stat' },
                                    { label: 'Hotel type', field: 'type_hebergement' },
                                    { label: 'Total rooms', field: 'available_room_count' }
                                ].map(({ label, field }) => (
                                    <div key={field} className={style_profile.detail_user}>
                                        <span className={style_profile.title}>{label}</span>
                                        {isLoading ? (
                                            <Skeleton width="200px" height="24px" />
                                        ) : isEditingHotel && field !== 'available_room_count' ? (
                                            <input
                                                type="text"
                                                className={style_profile.input_edit}
                                                value={field.includes('.') ? infosHotel?.localisation?.[field.split('.')[1]] || '' : infosHotel?.[field] || ''}
                                                onChange={(e) => {
                                                    if (field.includes('.')) {
                                                        setInfosHotel({
                                                            ...infosHotel,
                                                            localisation: {
                                                                ...infosHotel.localisation,
                                                                [field.split('.')[1]]: e.target.value
                                                            }
                                                        });
                                                    } else {
                                                        setInfosHotel({ ...infosHotel, [field]: e.target.value });
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <span>
                                                {field === 'available_room_count'
                                                    ? totalRooms.available_room_count
                                                    : field.includes('.')
                                                        ? infosHotel?.localisation?.[field.split('.')[1]] || `No ${label}`
                                                        : infosHotel?.[field] || `No ${label}`}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

