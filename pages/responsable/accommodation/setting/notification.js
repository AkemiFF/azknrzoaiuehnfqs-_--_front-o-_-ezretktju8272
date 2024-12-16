import Head from "next/head";
import style from './../../../../style/pages/responsable/accommodation/setting.module.css';
import { useContext, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import ResponsableLayoutContext from "@/layouts/context/responsableLayoutContext";
import { getResponsableAccessToken } from "@/util/Cookies";
import UrlConfig from "@/util/config";
import NotificationTemplate from "@/components/Notification";

export default function Notification() {
    const { user, setUser } = useContext(ResponsableLayoutContext);
    const router = useRouter();
    const [notifications, setNotification] = useState([]);




    const [menuSidebar, setMenuSidebar] = useState([
        { label: "Profil" },
        { label: "Info" },
        { label: "Commission" },
        { label: "Notification" },
        { label: "Security" },
        { label: "Help" }
    ]);

    const menu = 3;
    useEffect(() => {
        const getNotifications = async () => {
            try {
                const access = await getResponsableAccessToken();  // Get the access token

                fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/notifications/${user.id_etablissement}/`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access}`,  // Add the access token here
                    },

                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Erreur lors de la fetch');
                        }
                        return response.json();
                    })
                    .then(data => {
                        setNotification(data);
                    })
                    .catch(err => console.error('Erreur lors de la mise à jour des informations personnelles:', err));

            } catch (error) {
                console.error('Erreur lors de la récupération du token:', error);
            }
        }

        getNotifications();
    }, [user]);

    return (
        <>
            <Head>
                <title>Notification</title>
            </Head>

            <div className={style.container}>
                <div className={style.left_container}>
                    <div className={style.left_top_container}>
                        <span className={style.left_top_subtitle}>{menuSidebar[menu].label}</span>
                        <span className={style.left_top_title}>{user ? user.nom_hebergement : null}</span>

                    </div>
                    <div className={style.left_body_container}>
                        {menuSidebar.map((item, index) => {
                            return <Button key={index} onClick={() => router.push("/responsable/accommodation/setting/" + item.label.toLowerCase())} text className={menu == index ? "button-secondary" : style.text_button} raised={menu == index ? true : false} label={item.label} />
                        })}
                    </div>

                </div>
                <div className={style.right_body_container}>
                    {notifications.map((notification) => (
                        <NotificationTemplate key={notification.id} notification={notification} />
                    ))}
                </div>
            </div>
        </>
    )
}