import ProfileHeader from "@/components/ProfileHeader";
import { itemTemplate } from "@/components/Template/ItemTemplate";
import { itemTemplateVoyage } from "@/components/Template/itemTemplateVoyage";
import UserProfilMenu from "@/components/UserProfilMenu";
import AppTopbar from "@/layouts/AppTopbar";
import style from '@/style/pages/users/Cart.module.css';
import UrlConfig from "@/util/config";
import { getClientAccess, getNewAccess } from "@/util/Cookies";
import Cookies from "js-cookie";
import Head from "next/head";
import Link from "next/link";
import { DataView } from "primereact/dataview";
import { TabMenu } from "primereact/tabmenu";
import { useEffect, useState } from "react";

export default function Profile() {
    const [booking, setBooking] = useState([]);
    const [voyages, setVoyages] = useState([]);

    useEffect(() => {
        getClientAccess()
            .then((access) => {

                return fetch(`${UrlConfig.apiBaseUrl}/api/tour/client/reservations/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access}`,
                    },
                });
            })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        throw new Error(errorData.error || 'Error fetching cart data.');
                    });
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                setVoyages(data);
            })
            .catch((error) => {
                console.error('Error fetching cart data:', error);
            });

    }, []);


    useEffect(() => {
        const fetchData = () => {
            let access = Cookies.get('accessToken');

            if (!access) {
                getNewAccess()
                    .then(() => {
                        access = Cookies.get('accessToken');
                        if (!access) {
                            console.error('No access token available');
                            return;
                        }
                        return fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/client/reservations/`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${access}`,
                            },
                        });
                    })
                    .then((response) => {
                        if (!response.ok) {
                            return response.json().then((errorData) => {
                                throw new Error(errorData.error || 'Error fetching cart data.');
                            });
                        }
                        return response.json();
                    })
                    .then((data) => {

                        console.log(data);
                        setBooking(data);
                    })
                    .catch((error) => {
                        console.error('Error fetching cart data:', error);
                    });
            } else {
                fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/client/reservations/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access}`,
                    },
                })
                    .then((response) => {
                        if (!response.ok) {
                            return response.json().then((errorData) => {
                                throw new Error(errorData.error || 'Error fetching cart data.');
                            });
                        }
                        return response.json();
                    })
                    .then((data) => {
                        setBooking(data);
                    })
                    .catch((error) => {
                        console.error('Error fetching cart data:', error);
                    });
            }
        };

        fetchData();
    }, []);

    const listTemplate = (items) => {
        if (!items || items.length === 0) return null;

        let list = items.map((product, index) => {
            return itemTemplate(product, index);
        });

        return <div className="grid grid-nogutter">{list}</div>;
    };


    const listTemplateVoyage = (items) => {
        if (!items || items.length === 0) return null;

        let list = items.map((product, index) => {
            return itemTemplateVoyage(product, index);
        });

        return <div className="grid grid-nogutter">{list}</div>;
    };
    const [activeIndex, setActiveIndex] = useState(0);
    const itemRenderer = (item, itemIndex) => (
        <a className="p-menuitem-link flex align-items-center gap-2" onClick={() => setActiveIndex(itemIndex)}>
            <span className="font-bold">{item.name}</span>
        </a>
    );

    const items = [
        {
            name: `Résérvation Hebergement (${booking.length})`,
            template: (item) => itemRenderer(item, 0)
        },

        {
            name: `Résérvation Voyage (${voyages.length})`,
            template: (item) => itemRenderer(item, 2)
        }
    ];


    return (
        <div className={style.container}>
            <UserProfilMenu active="History" />
            <div className={style.profil_container}>
                <ProfileHeader title="Booking History" />
                <Link href={"/users"} className={style.back}><i className="pi pi-arrow-left" /> Back</Link>

                <div className={style.topMenu}>
                    <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} className="mb-5" />
                </div>
                {activeIndex == 0 ? (
                    <div className={style.booking}>
                        <span>Reservation Chambre</span>
                        <DataView value={booking} listTemplate={listTemplate} paginator rows={3} className="mt-4" />
                    </div>
                ) : (
                    <div className={style.booking}>
                        <span>Reservation voyage</span>
                        <DataView value={voyages} listTemplate={listTemplateVoyage} paginator rows={3} className="mt-4" />
                    </div>
                )
                }
                {/* </div> */}
            </div>
        </div>
    );

}

Profile.getLayout = function getLayout(page) {
    return (
        <>
            <Head>
                <title>User profile</title>
            </Head>
            <AppTopbar />
            {page}
        </>
    );
}

