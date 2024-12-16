import Head from "next/head";
import { useTranslation } from "react-i18next";
import style from './../../style/pages/users/Home.module.css';
import AppTopbar from "@/layouts/AppTopbar";
import Link from "next/link";
import { Image } from "primereact/image";

export default function Home() {

    const { t } = useTranslation();

    return (
        <>
            <Head>
                <title>{t("home")}</title>
            </Head>
            <div className={style.container}>
                <AppTopbar home />
                <div className={style.body_container}>
                    <div className={style.left_body}>
                        <span className={style.left_title}>{t("welcome_home")}</span>
                        <div className={style.list_button}>
                            <Link href={"/users/accommodation"} className={style.button_container}>
                                <div className={style.image_icon}>
                                    <Image imageClassName={style.icon} src="/images/users/accommodation.svg" alt="accommodation" />
                                </div>
                                <div className={style.button_text}>
                                    <span className={style.button_text_title}>{t("accommodation")}</span>
                                    <span className={style.button_text_subtitle}>{t("button_home_accommodation")}</span>
                                </div>
                            </Link>
                            <Link href={"/users/handcraft"} className={style.button_container}>
                                <div className={style.image_icon}>
                                    <Image imageClassName={style.icon} src="/images/users/handcraft.svg" alt="accommodation" />
                                </div>
                                <div className={style.button_text}>
                                    <span className={style.button_text_title}>{t("handcraft")}</span>
                                    <span className={style.button_text_subtitle}>{t("button_home_handcraft")}</span>
                                </div>
                            </Link>
                            <Link href={"/users/tour"} className={style.button_container}>
                                <div className={style.image_icon}>
                                    <Image imageClassName={style.icon} src="/images/users/tour.svg" alt="accommodation" />
                                </div>
                                <div className={style.button_text}>
                                    <span className={style.button_text_title}>{t("tour")}</span>
                                    <span className={style.button_text_subtitle}>{t("button_home_tour")}</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className={style.right_body}>
                        <Image src={"/images/home.png"} alt="not found" imageClassName={style.image} />
                    </div>
                </div>
                <div className={style.footer}>
                    <Link style={{ textDecoration: "none", color: "#fff" }} href={""}>{t("terms_services")}</Link>
                    <span>Copyright - 2024</span>
                    <Link style={{ textDecoration: "none", color: "#fff" }} href={""}>{t("private_policy")}</Link>
                </div>
            </div>
        </>
    )
}

Home.getLayout = function getLayout(page) {
    return (
        <>
            {page}
        </>
    );
}