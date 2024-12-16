import Head from "next/head";
import style from '@/style/pages/users/Cart.module.css';
import Link from "next/link";
import AppTopbar from "@/layouts/AppTopbar";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { useEffect, useState } from "react";
import UrlConfig from "@/util/config";
import { getClientAccess, getNewAccess } from "@/util/Cookies";
import Cookies from "js-cookie";
import { Rating } from "@mui/material";
import { Tag } from "primereact/tag";
import { DataView } from "primereact/dataview";
import { classNames } from 'primereact/utils';
import { TabMenu } from "primereact/tabmenu";
export default function Profile() {
    const [produits, setProduits] = useState([]);
    const [booking, setBooking] = useState([]);
    const [voyages, setVoyages] = useState([]);

    const getSeverity = (product) => {
        switch (product.inventoryStatus) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
    };

    useEffect(() => {

        getClientAccess()
            .then((access) => {

                return fetch(`${UrlConfig.apiBaseUrl}/api/artisanat/client/commandes/`, {
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
                setProduits(data);
            })
            .catch((error) => {
                console.error('Error fetching cart data:', error);
            });

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
                        console.log(data);
                        setBooking(data);
                    })
                    .catch((error) => {
                        console.error('Error fetching cart data:', error);
                    });
            }
        };

        fetchData();
    }, []);

    const itemTemplate = (product, index) => {
        console.log(product);
        return (
            <div key={product.id}>
                <div className={style.productCardLarge}>
                    <Image
                        imageClassName={style.product_image}
                        width={200}
                        src={`${product.chambre_reserve.images_chambre[0] ? UrlConfig.apiBaseUrl + product.chambre_reserve.images_chambre[0].images : "/images/artisanat/aucun_image.jpeg"}`}
                        alt={product.name} />
                    <div className={style.product_card}>
                        <div className={style.right_items}>
                            <Tag value={`${product.date_debut_reserve} - ${product.date_fin_reserve}`} severity={getSeverity(product)}></Tag>

                        </div>
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">Reservation chambre {product.chambre_reserve.chambre.type_chambre}</div>
                            <div className="text-2xl font-bold text-900"><b>à {product.hebergement.nom_hebergement}</b></div>
                            <Rating value={product.hebergement.nombre_etoile_hebergement} readOnly cancel={false}></Rating>
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-tag"></i>
                                    <span className="font-semibold">{product.chambre_reserve.chambre.type_chambre}</span>
                                </span>
                                {/* <Tag value={`${product.date_debut_reserve} - ${product.date_fin_reserve}`} severity={getSeverity(product)}></Tag> */}
                            </div>
                        </div>
                        <div className={style.right_items}>

                            <span className="text-2xl font-semibold">${product.prix_total_reserve}</span>
                            <Button icon="pi pi-info" className="p-button-rounded" disabled={product.inventoryStatus === 'OUTOFSTOCK'}></Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplateProducts = (product, index) => {
        return (
            <div key={product.id}>
                <div className={style.productCardLarge}>
                    {/* Affichage de l'image du produit */}
                    <Image
                        imageClassName={style.product_image}
                        width={200}
                        src={product.produit.images[0] ? product.produit.images[0].image : "/images/artisanat/aucun_image.jpeg"}
                        alt={product.produit.nom_produit_artisanal}
                    />
                    <div className={style.product_card}>
                        <div className={style.right_items}>
                            {/* Date de la commande */}
                            <Tag value={`Commande du ${product.date_commande_formatee}`} severity={product.status ? 'success' : 'danger'}></Tag>
                        </div>
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">

                            <div className="text-2xl font-bold text-900">{product.produit.nom_produit_artisanal}</div>
                            <div className="text-2xl font-bold text-900"><b>{product.produit.description_artisanat}</b></div>
                            <div className="text-2xl font-bold text-900"><b>Prix total: ${product.prix_total}</b></div>
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-tag"></i>
                                    <span className="font-semibold">{product.produit.total_likes} likes</span>
                                </span>
                            </div>
                        </div>
                        <div className={style.right_items}>
                            <span className="text-2xl font-semibold">Quantité: {product.quantite}</span>
                            {/* Bouton d'information */}
                            <Button icon="pi pi-info" className="p-button-rounded" disabled={product.status === 'OUTOFSTOCK'}></Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    const itemTemplateVoyage = (reservation, index) => {
        const imageUrl = reservation.voyage.images.find(image => image.couverture)?.image || "/images/artisanat/aucun_image.jpeg";
        const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${UrlConfig.apiBaseUrl}${imageUrl}`;

        return (
            <div key={reservation.id}>
                <div className={style.productCardLarge}>
                    <Image
                        imageClassName={style.product_image}
                        width={200}
                        src={fullImageUrl}
                        alt={reservation.voyage.nom_voyage}
                    />
                    <div className={style.product_card}>
                        <div className={style.right_items}>
                            <Tag value={`${reservation.voyage.date_debut} - ${reservation.voyage.date_fin}`} severity="info"></Tag>
                        </div>
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">Voyage: {reservation.voyage.nom_voyage}</div>
                            <div className="text-2xl font-bold text-900"><b>De {reservation.voyage.ville_depart} à {reservation.voyage.destination_voyage}</b></div>
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-users"></i>
                                    <span className="font-semibold">{reservation.nombre_voyageurs} Voyageur(s)</span>
                                </span>
                            </div>
                        </div>
                        <div className={style.right_items}>
                            <span className="text-2xl font-semibold">${reservation.prix_total}</span>
                            <Button icon="pi pi-info" className="p-button-rounded" />
                        </div>
                    </div>
                </div>
            </div>
        );


    };


    const listTemplate = (items) => {
        if (!items || items.length === 0) return null;

        let list = items.map((product, index) => {
            return itemTemplate(product, index);
        });

        return <div className="grid grid-nogutter">{list}</div>;
    };

    const listTemplateProduct = (items) => {
        if (!items || items.length === 0) return null;

        let list = items.map((product, index) => {
            return itemTemplateProducts(product, index);
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
            name: `Commande Produit (${produits.length})`,
            template: (item) => itemRenderer(item, 1)
        },
        {
            name: `Résérvation Voyage (${voyages.length})`,
            template: (item) => itemRenderer(item, 2)
        }
    ];


    return (
        <div className={style.container}>
            <div className={style.menu_container}>
                <Link style={{ textDecoration: "none" }} href={"/users/profil"}>
                    <span className={style.menu_item}><i className="pi pi-user" /> Profil</span>
                </Link>
                <Link style={{ textDecoration: "none" }} href={"/users/cart"}>
                    <span className={style.menu_item}><i className="pi pi-shopping-cart" /> Cart</span>
                </Link>
                <Link style={{ textDecoration: "none" }} href={"/users/history"}>
                    <span className={style.menu_active}><i className="pi pi-clock" /> History</span>
                </Link>
                <Link style={{ textDecoration: "none" }} href={"/users/notifications"}>
                    <span className={style.menu_item}><i className="pi pi-bell" /> Notification</span>
                </Link>
                <Link style={{ textDecoration: "none" }} href={"/users/security"}>
                    <span className={style.menu_item}><i className="pi pi-shield" /> Security</span>
                </Link>
                <Link style={{ textDecoration: "none" }} href={"/users/settings"}>
                    <span className={style.menu_item}><i className="pi pi-cog" /> Setting</span>
                </Link>
                <Link style={{ textDecoration: "none" }} href={"/users/login"}>
                    <span className={style.menu_item}><i className="pi pi-sign-out" /> Log out</span>
                </Link>
            </div>

            <div className={style.profil_container}>
                <Link href={"/users"} className={style.back}><i className="pi pi-arrow-left" /> Back</Link>

                <div className={style.topMenu}>
                    <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
                </div>
                {activeIndex == 0 ? (
                    <div className={style.booking}>
                        <span>Reservation Chambre</span>
                        <DataView value={booking} listTemplate={listTemplate} paginator rows={3} />
                    </div>
                ) : activeIndex == 1 ? (
                    <div className={style.booking}>
                        <span>Commande produit</span>
                        <DataView value={produits} listTemplate={listTemplateProduct} paginator rows={3} />
                    </div>
                ) : (
                    <div className={style.booking}>
                        <span>Reservation voyage</span>
                        <DataView value={voyages} listTemplate={listTemplateVoyage} paginator rows={3} />
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
