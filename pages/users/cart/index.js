import Head from "next/head";
import style from '@/style/pages/users/Cart.module.css';
import Link from "next/link";
import AppTopbar from "@/layouts/AppTopbar";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { useEffect, useState } from "react";
import UrlConfig from "@/util/config";
import { getNewAccess } from "@/util/Cookies";
import Cookies from "js-cookie";

export default function Profile() {
    const [produits, setProduits] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [orderSummary, setOrderSummary] = useState({ total: 0, items: [] });

    const handleCheckboxChange = (product, isChecked) => {
        const updatedProducts = isChecked
            ? [...selectedProducts, product]
            : selectedProducts.filter((p) => p.id !== product.id);

        // console.log('Updated Products:', updatedProducts); 

        setSelectedProducts(updatedProducts);
        updateOrderSummary(updatedProducts);
    };

    const updateOrderSummary = (products) => {
        const items = products.map((product) => ({
            id: product.produit.id,
            name: product.produit.nom_produit_artisanal,
            quantity: product.quantite,
            price: product.produit.prix_artisanat * product.quantite,
        }));

        const total = items.reduce((acc, item) => acc + item.price, 0);

        // console.log('Order Summary Items:', items); 
        // console.log('Order Summary Total:', total);  

        setOrderSummary({ total, items });
    };





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
                        return fetch(`${UrlConfig.apiBaseUrl}/api/artisanat/client-panier/`, {
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
                        setProduits(data.produits || []);
                    })
                    .catch((error) => {
                        console.error('Error fetching cart data:', error);
                    });
            } else {
                fetch(`${UrlConfig.apiBaseUrl}/api/artisanat/client-panier/`, {
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
                        setProduits(data.produits || []);
                    })
                    .catch((error) => {
                        console.error('Error fetching cart data:', error);
                    });
            }
        };

        fetchData();
    }, []);

    return (
        <div className={style.container}>
            <div className={style.menu_container}>
                <Link style={{ textDecoration: "none" }} href={"/users/profil"}>
                    <span className={style.menu_item}><i className="pi pi-user" /> Profil</span>
                </Link>
                <Link style={{ textDecoration: "none" }} href={"/users/cart"}>
                    <span className={style.menu_active}><i className="pi pi-shopping-cart" /> Cart</span>
                </Link>
                <Link style={{ textDecoration: "none" }} href={"/users/history"}>
                    <span className={style.menu_item}><i className="pi pi-clock" /> History</span>
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
                <div className={style.cart_container}>
                    <div className={style.cart}>
                        <div className={style.cart_top_container}>
                            <span>My Cart</span>
                        </div>
                        <div className={style.separateur}></div>
                        {produits.length > 0 ? (
                            produits.map((item, index) => {
                                const firstImage = item.produit.images[0]?.image;
                                const coverImage = item.produit.image_couverture;
                                const imageUrl = coverImage || firstImage;

                                return (
                                    <div key={index} className={style.productCard}>
                                        <input
                                            type="checkbox"
                                            onChange={(e) =>
                                                handleCheckboxChange(item, e.target.checked)
                                            }
                                        />
                                        {imageUrl ? (
                                            <Image
                                                src={UrlConfig.apiBaseUrl + imageUrl}
                                                alt={item.produit.nom_produit_artisanal}
                                                imageClassName={style.product_image}
                                                width={500}
                                                height={500}
                                            />
                                        ) : (
                                            <div className={style.no_image}>Aucune image du produit</div>
                                        )}
                                        <div className={style.product_card}>
                                            <div className={style.product_card_top_container}>
                                                <span className={style.nom_product}>{item.produit.nom_produit_artisanal}</span>
                                                <span className={style.price}>${item.produit.prix_artisanat}</span>
                                            </div>
                                            <span className={style.company}>{item.produit.artisanat.nom}</span>
                                            <span className={style.map}>
                                                <i style={{ fontSize: '14px' }} className="pi pi-map-marker" />
                                                {item.produit.artisanat.localisation_artisanat ? (
                                                    `${item.produit.artisanat.localisation_artisanat.ville || 'Unknown'}, ${item.produit.artisanat.localisation_artisanat.adresse || 'Unknown'}`
                                                ) : 'Antananarivo'}
                                            </span>
                                            <span className={style.description}>
                                                {item.produit.description_artisanat}
                                            </span>
                                            <span className={style.quantity}>Quantity: {item.quantite}</span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p>Your cart is empty.</p>
                        )}
                        <div className={style.paiement_container}>
                            <div className={style.body_title_container}>
                                <span className={style.body_title_numero}>1</span>
                                <span className={style.body_title_label}>Personal detail</span>
                            </div>
                            <div className={style.form_group_container}>
                                <div className={style.form_group_input}>
                                    <span className={style.form_label}>Firstname</span>
                                    <input
                                        type="text"
                                        className={style.form_input}
                                        placeholder="Enter your firstname"
                                    />
                                </div>
                                <div className={style.form_group_input}>
                                    <span className={style.form_label}>Lastname</span>
                                    <input
                                        type="text"
                                        className={style.form_input}
                                        placeholder="Enter your lastname"
                                    />
                                </div>
                                <div className={style.form_group_input}>
                                    <span className={style.form_label}>Region</span>
                                    <select className={style.form_select_green}>
                                        <option style={{ color: "#c3c3c3" }}>Enter your region</option>
                                        <option>Antananarivo</option>
                                    </select>
                                    <span className={style.form_icon}>
                                        <i style={{ fontSize: "20px" }} className='pi pi-map-marker' />
                                    </span>
                                </div>
                                <div className={style.form_group_input}>
                                    <span className={style.form_label}>Phone</span>
                                    <div className={style.input_tel_container}>
                                        <select className={style.form_select_green_mini}>
                                            <option style={{ color: "#c3c3c3" }}>+261</option>
                                            <option>+33</option>
                                        </select>
                                        <input className={style.form_input_green} type='text' />
                                    </div>
                                </div>
                            </div>
                            <div className={style.body_title_container}>
                                <span className={style.body_title_numero}>2</span>
                                <span className={style.body_title_label}>Payment method</span>
                            </div>
                        </div>
                    </div>
                    <div className={style.order_summary}>
                        <span className={style.order_summary_title}>Order summary</span>
                        {orderSummary.items.length > 0 ? (
                            orderSummary.items.map((item, index) => (
                                <div key={item.id} className={style.order_summary_detail}>
                                    <span>{item.name}</span>
                                    <span>{item.quantity}</span>
                                    <span className={style.price}>${item.price.toFixed(2)}</span>
                                </div>
                            ))
                        ) : (
                            <div className={style.order_summary_detail}>
                                <span>No items selected</span>
                                <span className={style.price}>$0.00</span>
                            </div>
                        )}
                        <div className={style.separateur}></div>
                        <div className={style.order_summary_detail}>
                            <span className={style.order_summary_detail_total}>Total</span>
                            <span className={style.price}>${orderSummary.total.toFixed(2)}</span>
                        </div>
                        <Button className="button-primary" label="Check out" />
                    </div>
                </div>
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
