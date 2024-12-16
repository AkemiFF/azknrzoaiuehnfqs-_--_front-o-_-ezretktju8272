import AppTopbar from "@/layouts/AppTopbar"
import Head from "next/head";
import style from './../../../style/pages/users/etablissement/etablissement.module.css';
import { Button } from "primereact/button"
import { Image } from "primereact/image"
import { Stepper } from "primereact/stepper"
import { StepperPanel } from "primereact/stepperpanel"
import { useState } from "react"
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

export default function ChoixType() {

    const router = useRouter();
    const [choixEtablissement, setChoixEtablissement] = useState(0);
    const { t } = useTranslation();

    const choixEtablissementFini = () => {
        let choix = "";
        if (choixEtablissement == 1) {
            choix = "accommodation";
            localStorage.setItem("type_etablissement", 1)
        }
        else if (choixEtablissement == 3) {
            choix = "tour"; localStorage.setItem("type_etablissement", 3)

        }
        if (choixEtablissement != 0) {
            router.push("/users/etablissement/" + choix);
        }
    }

    return (
        <>
            <div className={style.container}>
                <div className={style.left_container}>
                    <Image alt="logo" src="/images/logo-aftrip.png" />
                    <Stepper activeStep={1} linear className={style.stepper}>
                        <StepperPanel></StepperPanel>
                        <StepperPanel></StepperPanel>
                        <StepperPanel></StepperPanel>
                        <StepperPanel></StepperPanel>
                    </Stepper>
                </div>

                <div className={style.right_container}>
                    <div className={style.top_container}>
                        <span className={style.top_title}>Create your etablissement account</span>
                        <span className={style.top_subtitle}>Please enter your etablissement type</span>
                    </div>
                    <div className={style.list_button}>
                        <div onClick={() => setChoixEtablissement(1)} className={choixEtablissement == 1 ? style.button_container_active : style.button_container}>
                            <div className={style.image_icon}>
                                <Image imageClassName={style.icon} src="/images/users/accommodation.svg" alt="accommodation" />
                            </div>
                            <div className={style.button_text}>
                                <span className={style.button_text_title}>{t("accommodation")}</span>
                                <span className={style.button_text_subtitle}>{t("button_home_accommodation")}</span>
                            </div>
                        </div>
                        <div onClick={() => setChoixEtablissement(3)} className={choixEtablissement == 3 ? style.button_container_active : style.button_container}>
                            <div className={style.image_icon}>
                                <Image imageClassName={style.icon} src="/images/users/tour.svg" alt="accommodation" />
                            </div>
                            <div className={style.button_text}>
                                <span className={style.button_text_title}>{t("tour")}</span>
                                <span className={style.button_text_subtitle}>{t("button_home_tour")}</span>
                            </div>
                        </div>
                        <Button onClick={choixEtablissementFini} className="button-primary" label="continue" />
                    </div>
                </div>
            </div>
        </>
    )
}

ChoixType.getLayout = function getLayout(page) {
    return (
        <>
            <Head>
                <title>Choix type</title>
            </Head>
            <AppTopbar />
            {page}
        </>
    )
}