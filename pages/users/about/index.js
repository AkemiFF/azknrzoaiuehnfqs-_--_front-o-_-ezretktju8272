import Head from "next/head";
import style from "../../../style/pages/users/about/about.module.css"
import { useTranslation } from "react-i18next";
import { Accordion, AccordionTab } from "primereact/accordion"
import ReviewAbout from "@/components/reviewsAbout";
import Image from "next/image";
import { Button } from "primereact/button";
import Link from "next/link";

export default function About() {
    const { t } = useTranslation()

    const reviews = [
        {
            id: 1,
            nom: "Douglas Kirk",
            commentaire: "Aftrip made my travel planning so easy! I found a beautiful, locally-owned hotel and an amazing tour operator who showed us hidden gems of the region. The platform is user-friendly and reliable. Highly recommend!",
            note: 4,
            localisation: "Manchester, UK"
        },
        {
            id: 2,
            nom: "John Dumbble",
            commentaire: "I loved being able to purchase authentic African crafts directly from artisans. The quality was exceptional, and I felt good knowing my purchase supported local communities. Aftrip is my go-to for unique souvenirs.",
            note: 4,
            localisation: "Brooklyn, NY"
        },
        {
            id: 1,
            nom: "Joe Johnson",
            commentaire: "Aftrip exceeded my expectations! I was able to plan a complete trip with accommodation, tours, and even local crafts in just a few clicks. It’s great to see a platform dedicated to promoting local culture and tourism.",
            note: 4,
            localisation: "Glasgow, Scotland"
        },
        {
            id: 4,
            nom: "Nancy Dubois",
            commentaire: "La réservation via Aftrip a été une expérience fluide. Le service client était de premier ordre et les options d’hébergement étaient fantastiques. J'utiliserai certainement Aftrip à nouveau pour mes futurs voyages en Afrique.",
            note: 5,
            localisation: "Nice, France"
        }
    ]

    const missionDatas = [
        {
            title: t('facilitate'),
            text: t('facilitateText'),
            icon: 'pi pi-search'
        },
        {
            title: t('guarantee'),
            text: t('guaranteeText'),
            icon: 'pi pi-user'
        },
        {
            title: t('supportLocal'),
            text: t('supportLocalText'),
            icon: 'pi pi-globe'
        },
        {
            title: t('ensureSecurity'),
            text: t('ensureSecurityText'),
            icon: 'pi pi-shield'
        }
    ]

    return (
        <div className={style.body_about}>
            <Head>
                <title>About us</title>
            </Head>

            <article className={style.header_container}>
                <div className={style.aboutAftrip_container}>
                    <h1 style={{ fontStyle: "italic" }} className={style.aboutTitle}>{t('aboutAftrip')}</h1>
                    <p className={style.aboutAftrip_txt}>{t('aboutAftripTxt')}</p>
                </div>

                <div className={style.img_header_container}>
                    <Image src="/images/about/hotel.png" alt="Accommodation" width={300} height={200} className={style.img_header} />
                    <Image src="/images/about/artisanat.jpg" alt="Artisanat" width={300} height={200} style={{ marginLeft: "2rem" }} className={style.img_header} />
                    <Image src="/images/about/tour.png" alt="Tour circuit" width={300} height={200} style={{ marginLeft: "2rem" }} className={style.img_header} />
                </div>
            </article>

            <article className={style.mission_container}>
                <h2 style={{ textAlign: "center", fontSize: "1.7em" }}>{t('ourMission')}</h2>
                <p style={{ textAlign: "center" }}>{t('ourMissionP')}</p>

                <section className={style.section_big}>
                    <div className={style.section_mission_text}>
                        {missionDatas.map((missionData, index) => (
                            <div key={index} style={{ display: "flex", flexDirection: "row" }}>
                                <i className={`${missionData.icon}`} style={{ marginTop: "2rem" }}></i>

                                <div style={{ marginLeft: "2rem" }}>
                                    <h5>{missionData.title}</h5>
                                    <p className={style.missionText}>{missionData.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <Image src="/images/about/madagascar.png" alt="Aftrip" width={600} height={400} style={{ borderRadius: "5px" }} className={style.img_mission} />
                    </div>
                </section>
            </article>

            <article className={style.steps_container}>
                <h2 style={{ textAlign: "center", fontSize: "1.7em" }}>{t('collaborate')}</h2>
                <p style={{ textAlign: "center" }}>{t('collaborateP')}</p>

                <section className={style.section_step_container}>
                    <div className={style.img_step_container}>
                        <Image src="/images/about/signup.png" alt="Registration" width={400} height={300} className={style.img_register} />
                    </div>

                    <div className={style.register_container}>
                        <h4 style={{ fontSize: "1.5em" }} className={style.registerTitle}>{t('registerEsta')}</h4>
                        <p className={style.registerTxt}>{t('registerEstaText')}</p>
                    </div>
                </section>

                <section className={style.section_step2_container}>
                    <div className={style.img_step2_container}>
                        <Image src="/images/about/manage.png" alt="Manage" width={400} height={300} className={style.img_register} />
                    </div>

                    <div className={style.register2_container}>
                        <h4 style={{ fontSize: "1.5em" }} className={style.register2Title}>{t('manageAccount')}</h4>
                        <p className={style.register2Txt}>{t('manageAccountText')}</p>
                    </div>
                </section>

                <section className={style.section_step_container}>
                    <div className={style.img_step_container}>
                        <Image src="/images/about/revenue.png" alt="Revenue" width={400} height={300} className={style.img_register} />
                    </div>

                    <div className={style.register_container}>
                        <h4 style={{ fontSize: "1.5em" }}>{t('monetize')}</h4>
                        <p className={style.registerTxt}>{t('monetizeText')}</p>
                    </div>
                </section>
            </article>

            <article style={{ marginTop: "8rem" }} className={style.reviewsContainer}>
                <h2 style={{ textAlign: "center", fontSize: "1.7em" }}>{t('reviewsTitle')}</h2>
                <p style={{ textAlign: "center" }} className={style.reviewsP}>{t('collaborateP')}</p>

                <div className={style.reviewAbout_item_container}>
                    {
                        reviews.map((review, index) => {
                            return <div key={index} style={{ marginLeft: "1rem" }} className={style.review_container}><ReviewAbout
                                rate={review.note}
                                review={review.commentaire}
                                username={review.nom == null ? "Guest" : review.nom}
                                userPhoto={review.profilPic}
                                localisation={`${review.localisation == null ? "" : review.localisation.adresse} - ${review.localisation == null ? "" : review.localisation.ville}`}
                            /></div>
                        })
                    }
                </div>
            </article>

            <article style={{ marginBottom: "10rem" }} className={style.faqContainer}>
                <h2 style={{ textAlign: "center", fontSize: "1.7em" }}>{t('faq')}</h2>
                <p style={{ textAlign: "center" }}>{t('faqP')}</p>

                <section className={style.section_faq_container}>
                    <Accordion multiple activeIndex={[0]} className={style.accordion}>
                        <AccordionTab header={t('question1')} className={style.accordionHeader} >
                            <p>{t('reponse1')}</p>
                        </AccordionTab>
                        <AccordionTab header={t('question2')} className={style.accordionHeader}>
                            <p>{t('reponse2')}</p>
                        </AccordionTab>
                        <AccordionTab header={t('question3')} className={style.accordionHeader}>
                            <p>{t('reponse3')}</p>
                        </AccordionTab>
                        <AccordionTab header={t('question4')} className={style.accordionHeader}>
                            <p>{t('reponse4')}</p>
                        </AccordionTab>
                    </Accordion>

                    <Accordion multiple activeIndex={[0]} className={style.accordion}>
                        <AccordionTab header={t('question5')} className={style.accordionHeader}>
                            <p>{t('reponse5')}</p>
                        </AccordionTab>
                        <AccordionTab header={t('question6')} className={style.accordionHeader}>
                            <p>{t('reponse6')}</p>
                        </AccordionTab>
                        <AccordionTab header={t('question7')} className={style.accordionHeader}>
                            <p>{t('reponse7')}</p>
                        </AccordionTab>
                        <AccordionTab header={t('question8')} className={style.accordionHeader}>
                            <p>{t('reponse8')}</p>
                        </AccordionTab>
                    </Accordion>
                </section>

                <Link href="/users/faq"><Button label={t('seeFAQs')} className={style.custom_btn_faq} /></Link>
            </article>
        </div >
    )
}