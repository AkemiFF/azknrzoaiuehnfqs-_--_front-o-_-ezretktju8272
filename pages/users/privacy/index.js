import Head from "next/head"
import { useTranslation } from "react-i18next"
import style from "../../../style/pages/users/privacy/privacy.module.css"

export default function Privacy() {
    const { t } = useTranslation()

    const personalInfo = [
        { title: t('titreInfoText1'), text: t('infoText1') },
        { title: t('titreInfoText2'), text: t('infoText2') },
        { title: t('titreInfoText3'), text: t('infoText3') },
    ]

    const autoInfo = [
        { title: t('titreAutoText1'), text: t('autoText1') },
        { title: t('titreAutoText2'), text: t('autoText2') },
        { title: t('titreAutoText3'), text: t('autoText3') },
    ]

    const useInfo = [
        { title: t('useInfoTitle1'), text: t('useInfoTxt1') },
        { title: t('useInfoTitle2'), text: t('useInfoTxt2') },
        { title: t('useInfoTitle3'), text: t('useInfoTxt3') },
        { title: t('useInfoTitle4'), text: t('useInfoTxt4') },
    ]

    const shareInfos = [
        { title: t('shareTitre1'), text: t('shareTxt1') },
        { title: t('shareTitre2'), text: t('shareTxt2') },
        { title: t('shareTitre3'), text: t('shareTxt3') },
    ]

    const yourChoices = [
        { title: t('choiceTitle1'), text: t('choiceText1') },
        { title: t('choiceTitle2'), text: t('choiceText2') },
        { title: t('choiceTitle3'), text: t('choiceText3') },
        { title: t('choiceTitle4'), text: t('choiceText4') },
    ]

    return (
        <>
            <Head>
                <title>{t('privacyTitle')}</title>
            </Head>

            <section className={style.privacy_header}>
                <article>
                    <h1 style={{ fontSize: "2em", fontStyle: "italic" }}>{t('privacyTitle')}</h1>
                    <p style={{ marginTop: "2rem" }}>{t('dearAftrip')}</p>
                </article>

                <article style={{ marginTop: "4rem" }}>
                    <h2 style={{ fontSize: "1.5em" }}>1. {t('collectInformationTitle')}</h2>
                    <p style={{ marginTop: "2rem" }}>{t('dearAftrip')}</p>

                    <h3 style={{ fontSize: "1.25em", marginLeft: "2rem" }}>1.1 {t('collectInfo1')}</h3>
                    <p>{t('collectInfo1txt')}</p>

                    <ul>
                        {personalInfo.map((info, index) => (
                            <li key={index} style={{ marginBottom: "1rem" }}><span style={{ fontWeight: "700" }}>{info.title}</span>{info.text}</li>
                        ))}
                    </ul>

                    <h3 style={{ fontSize: "1.25em", marginLeft: "2rem", marginTop: "3rem" }}>1.2 {t('collectInfo2')}</h3>
                    <p>{t('collectInfoText2')}</p>

                    <ul>
                        {autoInfo.map((info, index) => (
                            <li key={index} style={{ marginBottom: "1rem" }}><span style={{ fontWeight: "700" }}>{info.title}</span>{info.text}</li>
                        ))}
                    </ul>

                </article>

                <article style={{ marginTop: "5rem" }}>
                    <h2 style={{ fontSize: "1.5em" }}>2. {t('useInformationTitle')}</h2>
                    <p style={{ marginTop: "2rem" }}>{t('useInformationText')}</p>

                    <ul>
                        {useInfo.map((info, index) => (
                            <li key={index} style={{ marginBottom: "1rem" }}><span style={{ fontWeight: "700" }}>{info.title}</span>{info.text}</li>
                        ))}
                    </ul>
                </article>

                <article style={{ marginTop: "5rem" }}>
                    <h2 style={{ fontSize: "1.5em" }}>3. {t('shareInfoTitle')}</h2>
                    <p style={{ marginTop: "2rem" }}>{t('shareInfoText')}</p>

                    <ul>
                        {shareInfos.map((info, index) => (
                            <li key={index} style={{ marginBottom: "1rem" }}><span style={{ fontWeight: "700" }}>{info.title}</span>{info.text}</li>
                        ))}
                    </ul>
                </article>

                <article style={{ marginTop: "5rem" }}>
                    <h2 style={{ fontSize: "1.5em" }}>4. {t('dataStorageTitle')}</h2>
                    <p style={{ marginTop: "2rem" }}>{t('dataStorageText1')}</p>
                    <p style={{ marginTop: "2rem" }}>{t('dataStorageText2')}</p>
                </article>

                <article style={{ marginTop: "5rem" }}>
                    <h2 style={{ fontSize: "1.5em" }}>5. {t('yourChoiceTitle')}</h2>
                    <p style={{ marginTop: "2rem" }}>{t('yourChoiceText')}</p>

                    <ul>
                        {yourChoices.map((info, index) => (
                            <li key={index} style={{ marginBottom: "1rem" }}><span style={{ fontWeight: "700" }}>{info.title}</span>{info.text}</li>
                        ))}
                    </ul>
                </article>

                <article style={{ marginTop: "5rem" }}>
                    <h2 style={{ fontSize: "1.5em" }}>6. {t('cookieTitle')}</h2>
                    <p style={{ marginTop: "2rem" }}>{t('cookieText')}</p>
                </article>

                <article style={{ marginTop: "5rem" }}>
                    <h2 style={{ fontSize: "1.5em" }}>7. {t('modifPrivacyTitle')}</h2>
                    <p style={{ marginTop: "2rem" }}>{t('modifPrivacyText')}</p>
                </article>

                <article style={{ marginTop: "5rem" }}>
                    <h2 style={{ fontSize: "1.5em" }}>8. {t('contactUs')}</h2>
                    <p style={{ marginTop: "2rem" }}>{t('contactUsText')}</p>
                </article>
            </section>

        </>
    )
}

