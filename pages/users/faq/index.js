import Head from "next/head";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import style from "../../../style/pages/users/faq/faq.module.css"

import home from "../../../public/images/home.png"

export default function Faqs() {
    const { t } = useTranslation()

    const faqs = [
        { id: 1, title: t('faq1'), text: t('faqtxt1'), },
        { id: 2, title: t('faq2'), text: t('faqtxt2'), },
        { id: 3, title: t('faq3'), text: t('faqtxt3'), },
        { id: 4, title: t('faq4'), text: t('faqtxt4'), },
        { id: 5, title: t('faq5'), text: t('faqtxt5'), },
        { id: 6, title: t('faq6'), text: t('faqtxt6'), },
        { id: 6, title: t('faq6'), text: t('faqtxt6'), },
        { id: 7, title: t('faq7'), text: t('faqtxt7'), },
        { id: 8, title: t('faq8'), text: t('faqtxt8'), },
        { id: 9, title: t('faq9'), text: t('faqtxt9'), },
        { id: 10, title: t('faq10'), text: t('faqtxt10'), },
        { id: 11, title: t('faq11'), text: t('faqtxt11'), },
        { id: 12, title: t('faq12'), text: t('faqtxt12'), },
        { id: 13, title: t('faq13'), text: t('faqtxt13'), },
        { id: 14, title: t('faq14'), text: t('faqtxt14'), },
        { id: 15, title: t('faq15'), text: t('faqtxt15'), },
        { id: 16, title: t('faq16'), text: t('faqtxt16'), },
        { id: 17, title: t('faq17'), text: t('faqtxt17'), },
        { id: 18, title: t('faq18'), text: t('faqtxt18'), },
        { id: 19, title: t('faq19'), text: t('faqtxt19'), },
        { id: 20, title: t('faq20'), text: t('faqtxt20'), },
        { id: 21, title: t('faq21'), text: t('faqtxt21'), },
        { id: 22, title: t('faq22'), text: t('faqtxt22'), },
    ]

    return (
        <>
            <Head>
                <title>{t('titleFAQ')}</title>
            </Head>

            <article className={style.header_faq}>
                <div className={style.faq_intro}>
                    <h1 style={{ fontSize: "2em", fontStyle: "italic" }}>{t('titleFAQ')}</h1>
                    <p className={style.faqIntrotitle}>{t('FAQIntro')}</p>
                    <p className={style.faqIntroTxt}>{t('FAQIntro2')} </p>
                </div>

                <div>
                    <Image src={home} alt="FAQ" width={300} height={300} className={style.img_header_faq} />
                </div>

            </article>

            <article className={style.faq_container}>
                {faqs.map((faq, index) => (
                    <div key={index} className={style.faq_div_container}>
                        <h3 style={{ fontSize: "1.5em", color: "#305555" }}>{faq.id}. {faq.title}</h3>
                        <p>{faq.text}</p>
                    </div>
                ))}
            </article>
        </>
    )
}