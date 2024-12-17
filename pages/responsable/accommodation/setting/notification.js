import NotificationTemplate from "@/components/Notification";
import SideBarMenu from "@/components/SideBarMenu";
import ResponsableLayoutContext from "@/layouts/context/responsableLayoutContext";
import { getResponsableAccessToken } from "@/util/Cookies";
import UrlConfig from "@/util/config";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import style from './../../../../style/pages/responsable/accommodation/setting.module.css';

export default function Notification() {
    const { user, setUser } = useContext(ResponsableLayoutContext);
    const router = useRouter();
    const [notifications, setNotification] = useState([]);
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
                <SideBarMenu menu={menu} />
                <div className={style.right_body_container}>
                    {notifications.map((notification) => (
                        <NotificationTemplate key={notification.id} notification={notification} />
                    ))}
                </div>
            </div>
        </>
    )
}