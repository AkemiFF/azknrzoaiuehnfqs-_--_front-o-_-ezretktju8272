import Head from "next/head";
import style from './../../../../style/pages/responsable/accommodation/setting.module.css';
import style_profile from "./../../../../style/pages/responsable/accommodation/setting/profil.module.css";
import { useState, useContext, useEffect } from "react";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";
import ResponsableLayoutContext from "@/layouts/context/responsableLayoutContext";
import { getCsrfFromToken } from '@/util/csrf';
import UrlConfig from "@/util/config";
import { getResponsableAccessToken } from "@/util/Cookies";

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
    const [etahandleSaveilProfil, setDetahandleSaveilProfil] = useState({});
    useEffect(() => {
        console.log(etahandleSaveilProfil);

    }, [etahandleSaveilProfil]);
    useEffect(() => {
        if (user) {
            const id_hebergement = user.id_etablissement;
            FetchProfil(id_hebergement, user.id);
        }
    }, [id, user]);

    async function FetchProfil(id_hebergement, id_responsable) {
        const access = await getResponsableAccessToken();

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

                //Fetch Detail Responsable
                fetch(`${UrlConfig.apiBaseUrl}/api/accounts/detail-responsable/${id_responsable}/`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFTOKEN': csrfToken,
                        'Authorization': `Bearer ${access}`,
                    }
                })
                    .then(response => response.json())
                    .then(hotelData => {
                        setDetailProfil(hotelData);
                    })
                    .catch(err => console.error('Erreur lors de la récupération des details des responsable:', err));


                //Fetch Informations Hotels
                fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/info/${id_hebergement}/`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFTOKEN': csrfToken,
                    }
                })
                    .then(response => response.json())
                    .then(hotelData => {
                        setInfosHotel(hotelData);
                    })
                    .catch(err => console.error('Erreur lors de la récupération des informations des Hotels:', err));


                // Fetch Total Rooms
                fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/${id_hebergement}/stats/`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFTOKEN': csrfToken,
                    }
                })
                    .then(response => response.json())
                    .then(totalRoom => {
                        setTotalRooms(totalRoom);
                    })
                    .catch(err => console.error('Erreur lors de la récupération des statistiques de l\'hôtel:', err));

            })
            .catch(err => console.error('Erreur lors de la récupération du token CSRF:', err));
    }

    function handleSave() {
        getCsrfFromToken()
            .then(csrfToken => {
                fetch(`${UrlConfig.apiBaseUrl}/api/accounts/detail-responsable/${user.id}/`, {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFTOKEN': csrfToken,
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
                    .catch(err => console.error('Erreur lors de la mise à jour des informations personnelles:', err));

            })
            .catch(err => console.error('Erreur lors de la récupération du token CSRF:', err));
    }

    function handleSaveHotel() {

        fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/info/${user.id_etablissement}/`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                // 'X-CSRFTOKEN': csrfToken,
            },
            body: JSON.stringify(infosHotel),
        })
            .then(response => {
                return response.json().then(data => ({ status: response.status, body: data }));
            })
            .then(({ status, body }) => {
                if (status !== 200 && status !== 204) {
                    console.error('Erreur lors de la mise à jour:', body);
                    throw new Error(`Erreur lors de la mise à jour des informations de l'hôtel: ${body.detail || status}`);
                }
                console.log('Informations de l\'hôtel mises à jour:', body);
                setUser({
                    ...user,
                    nom_hebergement: infosHotel.nom_hebergement
                });
                setIsEditingHotel(false);
            })
            .catch(err => console.error('Erreur lors de la mise à jour des informations de l\'hôtel:', err));
    }




    const [menuSidebar, setMenuSidebar] = useState([
        { label: "Profil" },
        { label: "Info" },
        { label: "Commission" },
        { label: "Notification" },
        { label: "Security" },
        { label: "Help" }
    ]);


    const menu = 0;

    return (
        <>
            <Head>
                <title>Profil</title>
            </Head>

            <div className={style.container}>
                <div className={style.left_container}>
                    <div className={style.left_top_container}>
                        <span className={style.left_top_subtitle}>{menuSidebar[menu].label}</span>
                        <span className={style.left_top_title}>{nameHotel?.nom_hebergement || 'No Hotel Name'}</span>
                    </div>
                    <div className={style.left_body_container}>
                        {menuSidebar.map((item, index) => {
                            return <Button key={index} onClick={() => router.push("/responsable/accommodation/setting/" + item.label.toLowerCase())} text className={menu == index ? "button-secondary" : style.text_button} raised={menu == index ? true : false} label={item.label} />
                        })}
                    </div>
                </div>
                <div className={style.right_body_container}>
                    <div className={style_profile.container}>
                        <div className={style_profile.user_title_container}>
                            <div className={style_profile.user_title_left}>
                                <Avatar label={detailProfil?.first_name[0]} shape="circle" className={style_profile.user_avatar} />
                                <div className={style_profile.user_title}>
                                    <span className={style_profile.title}>{detailProfil?.first_name || 'No Name'}</span>
                                    <span>Manager</span>
                                </div>
                            </div>
                        </div>
                        <div className="separateur"></div>
                        <div className={style_profile.detail_user_container}>
                            <div className={style_profile.detail_user_top_container}>
                                <span className={style_profile.title}>Personnal information</span>
                                {isEditingPersonal ? (
                                    <>
                                        <Button
                                            text
                                            className={style_profile.button_edit}
                                            icon="pi pi-save"
                                            raised
                                            label="Save"
                                            onClick={handleSave}
                                        />
                                        <Button
                                            text
                                            className={style_profile.button_cancel}
                                            icon="pi pi-cancel"
                                            raised
                                            label="Cancel"
                                            onClick={() => setIsEditingPersonal(false)}
                                        />
                                    </>
                                ) : (
                                    <Button
                                        text
                                        className={style_profile.button_edit}
                                        icon="pi pi-pen-to-square"
                                        raised
                                        label="Edit"
                                        onClick={() => { setIsEditingPersonal(!isEditingPersonal); setIsEditingHotel(false) }}
                                    />
                                )}

                            </div>
                            <div className={style_profile.detail_user_body_container}>
                                <div className={style_profile.detail_user}>
                                    <span className={style_profile.title}>First name</span>
                                    {isEditingPersonal ? (
                                        <input
                                            type="text"

                                            className={style_profile.input_edit}
                                            value={detailProfil?.first_name || ''}
                                            onChange={(e) => setDetailProfil({ ...detailProfil, first_name: e.target.value })}
                                        />
                                    ) : (
                                        <span>{detailProfil?.first_name || 'No Name'}</span>
                                    )}
                                </div>
                                <div className={style_profile.detail_user}>
                                    <span className={style_profile.title}>Lasts name</span>
                                    {isEditingPersonal ? (
                                        <input
                                            type="text"
                                            className={style_profile.input_edit}

                                            value={detailProfil?.last_name || ''}
                                            onChange={(e) => setDetailProfil({ ...detailProfil, last_name: e.target.value })}
                                        />
                                    ) : (
                                        <span>{detailProfil?.last_name || 'No Last name'}</span>
                                    )
                                    }
                                </div>
                                <div className={style_profile.detail_user}>
                                    <span className={style_profile.title}>Email address</span>
                                    {isEditingPersonal ? (
                                        // <input
                                        //     type="text"
                                        //     value={detailProfil?.email || ''}
                                        //     onChange={(e) => setDetailProfil({ ...detailProfil, email: e.target.value })}
                                        // />
                                        <span>{detailProfil?.email || 'No Email'}</span>
                                    ) : (
                                        <span>{detailProfil?.email || 'No Email'}</span>
                                    )}
                                </div>
                                <div className={style_profile.detail_user}>
                                    <span className={style_profile.title}>Phone number</span>
                                    {isEditingPersonal ? (
                                        <input
                                            type="text"
                                            className={style_profile.input_edit}

                                            value={detailProfil?.numero_responsable || ''}
                                            onChange={(e) => setDetailProfil({ ...detailProfil, numero_responsable: e.target.value })}
                                        />
                                    ) : (
                                        <span>{detailProfil?.numero_responsable || 'No Number'}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="separateur"></div>
                        <div className={style_profile.detail_user_container}>
                            <div className={style_profile.detail_user_top_container}>
                                <span className={style_profile.title}>Hotel information</span>
                                {isEditingHotel ? (
                                    <>
                                        <Button
                                            text
                                            className={style_profile.button_edit}
                                            icon="pi pi-save"
                                            raised
                                            label="Save"
                                            onClick={handleSaveHotel}
                                        />
                                        <Button
                                            text
                                            className={style_profile.button_cancel}
                                            icon="pi pi-cancel"
                                            raised
                                            label="Cancel"
                                            onClick={() => setIsEditingHotel(false)}
                                        />
                                    </>
                                ) : (
                                    <Button
                                        text
                                        className={style_profile.button_edit}
                                        icon="pi pi-pen-to-square"
                                        raised
                                        label="Edit"
                                        onClick={() => { setIsEditingHotel(!isEditingHotel); setIsEditingPersonal(false); }}
                                    />
                                )}
                            </div>
                            <div className={style_profile.detail_user_body_container}>
                                <div className={style_profile.detail_user}>
                                    <span className={style_profile.title}>Hotel name</span>
                                    {isEditingHotel ? (
                                        <input
                                            type="text"
                                            className={style_profile.input_edit}
                                            value={infosHotel?.nom_hebergement || ''}
                                            onChange={(e) => setInfosHotel({ ...infosHotel, nom_hebergement: e.target.value })}
                                        />
                                    ) : (
                                        <span>{infosHotel?.nom_hebergement || 'No Number'}</span>

                                    )}
                                </div>
                                <div className={style_profile.detail_user}>
                                    <span className={style_profile.title}>Address</span>
                                    {isEditingHotel ? (
                                        <input
                                            type="text"
                                            className={style_profile.input_edit}
                                            value={infosHotel?.localisation?.adresse || ''}
                                            onChange={(e) => setInfosHotel({ ...infosHotel, localisation: { ...infosHotel.localisation, adresse: e.target.value } })}
                                        />
                                    ) : (
                                        <span>{infosHotel?.localisation?.adresse || 'No Number'}</span>

                                    )}
                                </div>
                                <div className={style_profile.detail_user}>
                                    <span className={style_profile.title}>City</span>
                                    {isEditingHotel ? (
                                        <input
                                            type="text"
                                            className={style_profile.input_edit}
                                            value={infosHotel?.localisation.ville || ''}
                                            onChange={(e) => setInfosHotel({ ...infosHotel, localisation: { ...infosHotel.localisation, ville: e.target.value } })}
                                        />
                                    ) : (
                                        <span>{infosHotel?.localisation?.ville || 'No Number'}</span>
                                    )}
                                </div>
                                <div className={style_profile.detail_user}>
                                    <span className={style_profile.title}>NIF</span>
                                    {isEditingHotel ? (
                                        <input
                                            type="text"
                                            className={style_profile.input_edit}
                                            value={infosHotel?.nif || ''}
                                            onChange={(e) => setInfosHotel({ ...infosHotel, nif: e.target.value })}
                                        />
                                    ) : (
                                        <span>{infosHotel?.nif || 'No Number'}</span>

                                    )}
                                </div>
                                <div className={style_profile.detail_user}>
                                    <span className={style_profile.title}>STAT</span>
                                    {isEditingHotel ? (
                                        <input
                                            type="text"
                                            className={style_profile.input_edit}
                                            value={infosHotel?.stat || ''}
                                            onChange={(e) => setInfosHotel({ ...infosHotel, stat: e.target.value })}
                                        />
                                    ) : (
                                        <span>{infosHotel?.stat || 'No Number'}</span>

                                    )}
                                </div>
                                <div className={style_profile.detail_user}>
                                    <span className={style_profile.title}>Hotels type</span>
                                    {isEditingHotel ? (
                                        <input
                                            type="text"
                                            className={style_profile.input_edit}
                                            value={infosHotel?.type_hebergement || ''}
                                            onChange={(e) => setInfosHotel({ ...infosHotel, type_hebergement: e.target.value })}
                                        />
                                    ) : (
                                        <span>{infosHotel?.type_hebergement || 'No Number'}</span>

                                    )}
                                </div>
                                <div className={style_profile.detail_user}>
                                    <span className={style_profile.title}>Total rooms</span>
                                    {isEditingHotel ? (
                                        <input
                                            type="text"
                                            className={style_profile.input_edit}
                                            value={infosHotel?.available_room_count || ''}
                                            onChange={(e) => setInfosHotel({ ...infosHotel, available_room_count: e.target.value })}
                                        />
                                    ) : (
                                        <span>{totalRooms.available_room_count}</span>

                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}