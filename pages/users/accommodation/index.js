import CardSuggestion from "@/components/card/CardSuggestion";
import Filter from "@/components/Filter";
import Review from "@/components/Review";
import SwiperCarousel from "@/components/Swiper";
import { UrlConfig } from "@/util/config";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { Rating } from "primereact/rating";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import style from '../../../style/pages/users/accommodation/accommodation.module.css';
export default function Home() {

    const { t } = useTranslation();

    const router = useRouter();

    // Image carrosels
    let images = [
        {
            name: "Hotel LUXURA",
            label: "Lorem ipsum dolor sit amet veniam wisi dolore clita lorem augue sed aliquam et invidunt eos clita ea eros. Sanctus sit accusam ipsum dolores clita ipsum elitr labore sea voluptua duo amet.",
            note: 4,
            imageLink: "/images/hotel/chambre.jpg"
        },
        {
            name: "Hotel SPan",
            label: "Lorem ipsum dolor sit amet veniam wisi dolore clita lorem augue sed aliquam et invidunt eos clita ea eros. Sanctus sit accusam ipsum dolores clita ipsum elitr labore sea voluptua duo amet.",
            note: 2,
            imageLink: "/images/hotel/hotel.jpg"
        },
        {
            name: "Hotel Brajas",
            label: "Lorem ipsum dolor sit amet veniam wisi dolore clita lorem augue sed aliquam et invidunt eos clita ea eros. Sanctus sit accusam ipsum dolores clita ipsum elitr labore sea voluptua duo amet.",
            note: 3,
            imageLink: "/images/hotel/chambre.jpg"
        },
        {
            name: "Hotel Vahiny",
            label: "Lorem ipsum dolor sit amet veniam wisi dolore clita lorem augue sed aliquam et invidunt eos clita ea eros. Sanctus sit accusam ipsum dolores clita ipsum elitr labore sea voluptua duo amet.",
            note: 4,
            imageLink: "/images/hotel/hotel2.jpg"
        },
        {
            name: "Hotel Le louvre",
            label: "Lorem ipsum dolor sit amet veniam wisi dolore clita lorem augue sed aliquam et invidunt eos clita ea eros. Sanctus sit accusam ipsum dolores clita ipsum elitr labore sea voluptua duo amet.",
            note: 5,
            imageLink: "/images/hotel/chambre.jpg"
        }
    ]

    const [regions, setRegions] = useState();
    const [regionSelected, setRegionSelected] = useState();
    const getAllRegion = () => {
        fetch("/api/region/getAll")
            .then(res => res.json())
            .then(data => setRegions(data))
            .catch(error => console.log(error));
    }

    const [check, setCheck] = useState();
    const [guest, setGuest] = useState();

    //suggestion
    const [suggestions, setSuggestions] = useState({ hebergements: [] });
    const getSuggestion = () => {
        fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/suggestion/`)
            .then(res => res.json())
            .then(data => setSuggestions(data))
            .catch(error => console.log(error));
    }

    //review
    const [reviews, setReviews] = useState([]);
    const getReview = () => {
        fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/avis-clients/`)
            .then(res => res.json())
            .then(data => setReviews(data))
            .catch(error => console.log(error));
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            getAllRegion();
            getSuggestion();
            getReview();

        }
    }, []);

    const imageCarouselTemplate = (item) => {
        return (
            <div className={style.image_container}>
                <Image imageClassName={style.image} src={item.imageLink} alt="imge" />
                <div className={style.detail_image_container}>
                    <span className={style.detail_image_title}>{item.name}</span>
                    <span className={style.detail_image_subtitle}>{item.label}</span>
                    <Rating
                        value={item.note}
                        disabled
                        cancel={false}
                        pt={{
                            onIcon: () => ({
                                style: {
                                    "width": "50px",
                                    "height": "40px",
                                    "color": "#FFD700"
                                }
                            }),
                            offIcon: () => ({
                                style: {
                                    display: "none"
                                }
                            })
                        }}
                    />
                </div>
            </div>
        )
    }




    return (
        <>
            <Head>
                <title>Home</title>
            </Head>


            <div className={style.container}>

                <div className={style.image_carousel}>
                    <div className={style.carousel}>
                        <SwiperCarousel />

                    </div>
                    <div className={style.image_filter}>
                        <Filter
                        />
                    </div>
                </div>


                <div className={style.suggestion_container}>
                    <span className={style.suggestion_title}>Suggestions for you</span>
                    <div className={style.suggestion_item_container}>
                        {
                            suggestions.hebergements && suggestions.hebergements.map((suggestion, index) => {
                                return (
                                    <CardSuggestion
                                        key={index}
                                        id={suggestion.id}
                                        nb_like={suggestion.total_likes}
                                        image={suggestion.image ? suggestion.image : "/images/hotel/chambre.jpg"}
                                        note={suggestion.note_moyenne}
                                        name={suggestion.nom_hebergement}
                                        localisation={suggestion.ville}
                                        description={suggestion.description_hebergement}
                                        onClick={() => { router.push("/users/accommodation/" + suggestion.id) }}
                                    />
                                )
                            })
                        }
                    </div>
                    <div className={style.suggestion_bottom}>
                        <Button onClick={() => router.push("/users/accommodation/filter")} className="button-primary" label="See more" />
                    </div>
                </div>


                <div className={style.service}>
                    <span className={style.service_title}>{t("get_best_service")}</span>
                    <div className={style.service_body}>
                        <Image imageClassName={style.image_service} alt="accommodation" className={style.image_service_container} src="/images/accommodation.webp" />

                        <div className={style.service_detail_container}>
                            <div className={style.service_card}>
                                <span className={style.service_card_title}>{t("quality")}</span>
                                <span className={style.service_card_content}>
                                    Nous nous engageons à fournir des produits et services de la plus haute qualité, répondant aux attentes et dépassant les standards du marché.
                                </span>
                            </div>
                            <div className={style.service_card}>
                                <span className={style.service_card_title}>{t("transparency")}</span>
                                <span className={style.service_card_content}>
                                    La transparence est au cœur de nos valeurs. Nous assurons une communication claire et honnête avec nos clients et partenaires.
                                </span>
                            </div>
                            <div className={style.service_card}>
                                <span className={style.service_card_title}>{t("custormer_experience")}</span>
                                <span className={style.service_card_content}>
                                    Nous mettons tout en œuvre pour offrir une expérience client exceptionnelle, en mettant l&apos;accent sur la satisfaction et l&apos;accompagnement.
                                </span>
                            </div>
                            <div className={style.service_card}>
                                <span className={style.service_card_title}>Support</span>
                                <span className={style.service_card_content}>
                                    Notre équipe de support est disponible pour répondre à vos questions et résoudre vos problèmes rapidement et efficacement.
                                </span>
                            </div>

                        </div>
                    </div>
                </div>

                <div className={style.review_container}>
                    <div className={style.review_top}>
                        <span className={style.review_title}>{t("avis_clients_title")}</span>
                        <span className={style.review_subtitle}>{t("avis_clients_subtitle")}</span>
                    </div>
                    <div className={style.review_item_container}>
                        {
                            reviews.map((review, index) => {
                                // try{
                                //     setAdresse(review.hebergement.localisation.adresse)
                                //     setVille(review.hebergement.localisation.ville)
                                // } catch {

                                // }
                                return <Review

                                    key={index}
                                    rate={review.note}
                                    review={review.commentaire}
                                    nom={review.hebergement.nom_hebergement}
                                    username={review.client.username == null ? "Guest" : review.client.username}
                                    userPhoto={review.client.profilPic}
                                    localisation={`${review.hebergement.localisation == null ? "" : review.hebergement.localisation.adresse} - ${review.hebergement.localisation == null ? "" : review.hebergement.localisation.ville}`}
                                />
                            })
                        }
                    </div>
                </div>

            </div>



        </>
    )
}