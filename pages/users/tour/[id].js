import Head from "next/head";
import { useTranslation } from "react-i18next";
import style from '../../../style/pages/users/tour/id.module.css';
import FilterTour from "@/components/FilterTour";
import { Button } from "primereact/button";
import GallerieVoyage from "@/components/GallerieVoyage";
import { TabPanel, TabView } from "primereact/tabview";
import DetailTravel from "@/components/card/DetailTravel";
import dynamic from "next/dynamic";
import TimelineEvent from "@/layouts/users/tour/TimelineEvent";
import { Avatar } from "primereact/avatar";
import PopularTripCard from "@/components/card/PopularTripCard";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { UrlConfig } from "@/util/config";
import TripModal from "@/components/modal/TripModal";

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function InfoTour() {
    const { t } = useTranslation();
    const router = useRouter();
    const { id } = router.query;

    const [voyage, setVoyage] = useState(null);
    const [popularVoyages, setPopularVoyages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingVisible, setBookingVisible] = useState(false);
    const [location, setLocalisation] = useState()

    // Fetch voyage details when ID changes
    useEffect(() => {
        if (id) {
            fetch(`${UrlConfig.apiBaseUrl}/api/tour/voyages/${id}/`)
                .then(res => res.json())
                .then(data => {
                    setVoyage(data);
                    console.log(data);
                    data.tour_operateur.localisation ? setLocalisation(data.tour_operateur.localisation) : setLocalisation({
                        "latitude": 1,
                        "longitude": 1,
                    });
                    setLoading(false);
                })
                .catch(error => console.error('Error fetching voyage details:', error));
        }
    }, [id]);

    // Fetch popular voyages
    useEffect(() => {
        fetch(`${UrlConfig.apiBaseUrl}/api/tour/voyages-populaire/`)
            .then(res => res.json())
            .then(data => {
                setPopularVoyages(data);
                setLoading(false);
            })
            .catch(error => console.error('Error fetching popular voyages:', error));
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!voyage) {
        return <div>No voyage data available.</div>;
    }

    const panelClassName = (parent, index) => {
        if (parent.state.activeIndex === index)
            return style.tab_active;
        else
            return style.tab;
    };

    return (
        <>
            <Head>
                <title>Info {t("tour")}</title>
            </Head>

            <div className={style.container}>
                <div className={style.filter_header_top}>
                    <div className={style.filter_header_top_title_container}>
                        <span className={style.filter_header_top_title}>{t("tour_header_title")}</span>
                        <span className={style.filter_header_top_subtitle}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat explicabo cupiditate </span>
                    </div>
                    <div className={style.filter_parent}>
                        <FilterTour />
                    </div>
                </div>
                <div className={style.header_container}>
                    <div className={style.header_left}>
                        <span className={style.header_left_title}>{voyage.nom_voyage}</span>
                    </div>
                    <div className={style.header_right}>
                        <div className={style.header_right_button_container}>
                            <Button raised icon="pi pi-heart" rounded text className={style.header_right_button} />
                            <span className={style.header_right_button_label}>Like</span>
                        </div>
                        <div className={style.header_right_button_container}>
                            <Button raised icon="pi pi-send" rounded text className={style.header_right_button} />
                            <span className={style.header_right_button_label}>Share</span>
                        </div>
                        <div className={style.header_right_button_container}>
                            <Button raised icon="pi pi-save" rounded text className={style.header_right_button} />
                            <span className={style.header_right_button_label}>Save</span>
                        </div>
                    </div>
                </div>
                <GallerieVoyage images={voyage.images_voyage} />
                <div className={style.tour_detail_container}>
                    <div className={style.tour_detail_left}>
                        <span className={style.tour_detail_title}>{voyage.ville_depart} - {voyage.destination_voyage}</span>
                        <div></div>
                    </div>
                    <div className={style.tour_detail_right}>
                        <span className={style.tour_detail_price}>${voyage.prix_voyage}/</span>
                        <span>person</span>
                    </div>
                </div>
                <div className={style.body_accommodation}>
                    <TabView
                        pt={{
                            root: { className: style.tab_container },
                            panelContainer: { className: style.tab_container },
                            navContainer: { className: style.tab_container }
                        }}
                    >
                        <TabPanel
                            pt={{
                                headerAction: ({ parent }) => ({
                                    className: panelClassName(parent, 0)
                                }),
                                header: { className: style.tab_container }
                            }}
                            header={t("overview")}
                        >
                            <div className={style.overview}>
                                <div className={style.accommodation_detail}>
                                    <span className={style.accommodation_detail_title}>{t("description")}</span>
                                    <div className={style.paragraphe}>
                                        {voyage.description_voyage}
                                    </div>
                                </div>
                                <div className={style.accommodation_detail}>
                                    <span className={style.accommodation_detail_title}>{t("programs")}</span>
                                    <TimelineEvent voyage={voyage} />
                                </div>
                                <div className={style.accommodation_detail}>
                                    <span className={style.accommodation_detail_title}>{t("travel_inclusion")}</span>
                                    <ul>
                                        {voyage.inclusions && voyage.inclusions.map((inclusion) => (
                                            <li key={inclusion.id}>{inclusion.nom_inclusion}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel
                            pt={{
                                headerAction: ({ parent }) => ({
                                    className: panelClassName(parent, 1)
                                }),
                                header: { className: style.tab_container }
                            }}
                            header={t("programs")}
                        >
                            <TimelineEvent voyage={voyage} />
                        </TabPanel>
                        <TabPanel
                            pt={{
                                headerAction: ({ parent }) => ({
                                    className: panelClassName(parent, 2)
                                }),
                                header: { className: style.tab_container }
                            }}
                            header={t("travel_inclusion")}
                        >
                            <ul>
                                {voyage.inclusions && voyage.inclusions.map((inclusion) => (
                                    <li key={inclusion.id}>{inclusion.nom_type_inclusion}</li>
                                ))}
                            </ul>
                        </TabPanel>
                    </TabView>
                    <div className={style.tour_card_container}>
                        <DetailTravel
                            date_debut={voyage.date_debut}
                            date_fin={voyage.date_fin}
                            places_disponibles={voyage.places_disponibles}
                            prix_voyage={voyage.prix_voyage}
                            setBookingVisible={setBookingVisible}
                        />
                        <div className={style.tour_card}>
                            <Map
                                style={{ width: "100%", height: "300px" }}
                                lat={location.latitude}
                                lng={location.longitude}
                            />
                        </div>
                        <div className={style.tour_card}>
                            <div className={style.operator_detail_header}>
                                <Avatar
                                    shape="circle"
                                    image={voyage.tour_operateur.images_tour[0] ? UrlConfig.apiBaseUrl + voyage.tour_operateur.images_tour[0].image : "Image Tour"}
                                    className={style.operator_avatar}
                                />
                                <div className={style.operator_detail_title_container}>
                                    <span className={style.operator_detail_title}>{voyage.tour_operateur.nom_operateur}</span>
                                    <span className={style.operator_detail_subtitle}>{voyage.tour_operateur.adresse_operateur}</span>
                                </div>
                            </div>
                            <div className={style.paragraphe}>
                                {voyage.tour_operateur.description_operateur}
                            </div>
                            <Button onClick={() => router.push("/users/tour/operator/1")} className="button-primary" label="About the operator" />
                        </div>
                    </div>
                </div>
                <div className={style.suggestion_container}>
                    <span className={style.suggestion_title}>{/* t("you_would_like_it") */}</span>
                    <div className={style.suggestion_body}>
                        {popularVoyages.map((popularVoyage) => (
                            <PopularTripCard key={popularVoyage.id} voyage={popularVoyage} />
                        ))}
                    </div>
                </div>
            </div>
            <TripModal
                id={voyage.id}
                description={`Résérvation de voyage ${voyage.nom_voyage} à ${voyage.tour_operateur.nom_operateur}`}
                tour={voyage.tour_operateur.nom_operateur}
                nom_voyage={voyage.nom_voyage}
                images={voyage.images_voyage}
                visible={bookingVisible}
                onHide={() => setBookingVisible(false)}
            />
        </>
    );
}
