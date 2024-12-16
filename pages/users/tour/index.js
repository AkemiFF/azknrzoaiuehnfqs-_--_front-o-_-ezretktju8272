import FilterTour from "@/components/FilterTour";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import style from './../../../style/pages/users/tour/tour.module.css';
import { Image } from "primereact/image";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import PopularTripCard from "@/components/card/PopularTripCard";
import Link from "next/link";
import { UrlConfig } from "@/util/config";
import React, { useState, useEffect } from 'react';

export default function Tour() {
    const router = useRouter();
    const { t } = useTranslation();

    // States
    const [popular_voyage, setPopular_voyage] = useState([]);
    const [popular_operateur, setPopular_operateur] = useState([]);
    const [loadingVoyages, setLoadingVoyages] = useState(true);
    const [loadingOperators, setLoadingOperators] = useState(true);

    // Fetch popular voyages
    useEffect(() => {
        fetch(`${UrlConfig.apiBaseUrl}/api/tour/voyages-populaire/`)
            .then(res => res.json())
            .then(data => {
                setPopular_voyage(data);
                setLoadingVoyages(false);
            })
            .catch(error => console.log(error));
    }, []);

    // Fetch popular operators
    useEffect(() => {
        fetch(`${UrlConfig.apiBaseUrl}/api/tour/operateurs-populaires/`)
            .then(res => res.json())
            .then(data => {
                setPopular_operateur(data);
                setLoadingOperators(false);
            })
            .catch(error => console.log(error));
    }, []);

    if (loadingVoyages || loadingOperators) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Head>
                <title>Tour</title>
            </Head>

            <div className={style.container}>
                <div className={style.tour_filter_container}>
                    <Image alt="" src="/images/tours/tour.png" imageClassName={style.image_header_filter} />
                    <div className={style.right_container}>
                        <div className={style.right_title_container}>
                            <span className={style.right_title}>Find your best trip expedition in Madagascar with operator tour on Aftrip</span>
                            <span>Lorem ipsum dolor emet si Lorem ipsum dolor emet siLorem ipsum dolor emet siLorem ipsum dolor emet siLorem ipsum dolor emet siLorem ipsum dolor emet si</span>
                        </div>
                        <FilterTour />
                    </div>
                </div>
                <div className={style.categorie_container}>
                    <div className={style.categorie_top}>
                        <span className={style.categorie_title}>{t("discover_mada_another_way")}</span>
                        <span className={style.categorie_subtitle}>{t("dont_wait_tommorow_tour")}</span>
                        <Button onClick={() => router.push("/users/tour/filter")} label={t("explore_all_available_trip")} style={{ width: "320px" }} className="button-primary" />
                    </div>

                    <div className={style.image_categorie_container}>
                        <Link href={"/users/tour/filter?type=wooden"} className={style.image_categorie_content}>
                            <Image src="/images/tours/aventure.png" imageClassName={style.image_categorie} alt="woode" />
                            <div className={style.image_categorie_detail}>
                                <span>{t("adventure")}</span>
                            </div>
                        </Link>
                        <div className={style.image_middle}>
                            <Link href={"/users/tour/filter?type=wooden"} className={style.image_categorie_content}>
                                <Image src="/images/tours/tradition.png" imageClassName={style.image_categorie} alt="woode" />
                                <div className={style.image_categorie_detail}>
                                    <span>{t("tradition")}</span>
                                </div>
                            </Link>
                            <Link href={"/users/tour/filter?type=wooden"} className={style.image_categorie_content}>
                                <Image src="/images/tours/landscape.png" imageClassName={style.image_categorie} alt="woode" />
                                <div className={style.image_categorie_detail}>
                                    <span>{t("landscape")}</span>
                                </div>
                            </Link>
                            <Link href={"/users/tour/filter?type=wooden"} className={style.image_categorie_content}>
                                <Image src="/images/tours/culture.png" imageClassName={style.image_categorie} alt="woode" />
                                <div className={style.image_categorie_detail}>
                                    <span>{t("culture")}</span>
                                </div>
                            </Link>
                            <Link href={"/users/tour/filter?type=wooden"} className={style.image_categorie_content}>
                                <Image src="/images/tours/discovery.png" imageClassName={style.image_categorie} alt="woode" />
                                <div className={style.image_categorie_detail}>
                                    <span>{t("discovery")}</span>
                                </div>
                            </Link>
                        </div>
                        <Link href={"/users/tour/filter?type=wooden"} className={style.image_categorie_content}>
                            <Image src="/images/tours/nature.png" imageClassName={style.image_categorie} alt="woode" />
                            <div className={style.image_categorie_detail}>
                                <span>{t("nature")}</span>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className={style.top_value_container}>
                    <div className={style.top_value_top}>
                        <span className={style.top_value_title}>{t("top_value_for_you")}</span>
                        <span className={style.top_value_subtitle}>{t("dont_wait_until_tommorow_discover_tour")}</span>
                    </div>

                    <div className={style.top_value_body}>
                        <div className={style.top_value_body_left}>
                            <div className={style.top_value_left_detail_container}>
                                <Image src="/images/artisanat/bousole.svg" alt="bousole" imageClassName={style.top_value_left_detail_image} />
                                <div className={style.top_value_left_detail}>
                                    <span className={style.top_value_left_detail_title}>{t("plan_trip")}</span>
                                    <span>{t("discover_some_unique_trip")}</span>
                                </div>
                            </div>
                            <div className={style.top_value_left_detail_container}>
                                <Image src="/images/artisanat/map.svg" alt="map" imageClassName={style.top_value_left_detail_image} />
                                <div className={style.top_value_left_detail}>
                                    <span className={style.top_value_left_detail_title}>{t("explore_save")}</span>
                                    <span>{t("discover_explore_save")}</span>
                                </div>
                            </div>
                            <div className={style.top_value_left_detail_container}>
                                <Image src="/images/artisanat/palm.svg" alt="palm" imageClassName={style.top_value_left_detail_image} />
                                <div className={style.top_value_left_detail}>
                                    <span className={style.top_value_left_detail_title}>{t("enjoy_trip")}</span>
                                    <span>{t("discover_enjoy_trip")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={style.suggestion_container}>
                    <div className={style.suggestion_title_container}>
                        <span className={style.suggestion_title}>Popular trip at the moment</span>
                        <span className={style.suggestion_subtitle}>Don’t wait until tomorrow! Discover your adventure now and feel the sensation of closeness to nature around you here in Madagascar. To get the best adventure, you just need to leave and go where you like.</span>
                    </div>
                    <div className={style.suggestion_item_container}>
                        {popular_voyage.map(voyage => (
                            <PopularTripCard
                                key={voyage.id}
                                voyage={voyage}
                            />
                        ))}
                    </div>
                </div>

                <div className={style.group_trip_container}>
                    <Image src="/images/tours/group.png" alt="group" imageClassName={style.image_group_trip} />
                    <div className={style.group_trip_detail}>
                        <span className={style.group_trip_title}>{t("discover_and_enjoy_group_trip")}</span>
                        <span className={style.group_trip_subtitle}>{t("join_on_group_expedition")}</span>
                        <Button label={t("see_available_group_trip")} className="button-primary" style={{ width: "350px" }} />
                    </div>
                </div>

                <div className={style.list_operator_container}>
                    <span className={style.list_operator_title}>{t("popular_operator_tour")}</span>
                    <div className={style.list_operator}>
                        {popular_operateur.map((operator) => {
                            const imageUrl = (operator.images_tour[0] ? UrlConfig.apiBaseUrl + operator.images_tour[0]?.image : '/images/default-image.jpg');

                            return (
                                <Link key={operator.id} href={`/users/tour/operator/${operator.id}`} className={style.operator}>
                                    <Image
                                        className={style.image_operator}
                                        src={imageUrl}
                                        alt={operator.nom_operateur}
                                        width={400}
                                        height={250}
                                    />
                                    <div className={style.operator_detail}>
                                        <span>{operator.nom_operateur}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
