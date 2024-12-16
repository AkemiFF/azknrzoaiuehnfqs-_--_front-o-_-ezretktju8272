import Head from "next/head";
import style from './../../../style/pages/users/etablissement/etablissement.module.css';
import AppTopbar from "@/layouts/AppTopbar";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Image } from "primereact/image";
import { useRef, useState } from "react";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import UrlConfig from "@/util/config";
import { Toast } from "primereact/toast";
import { getCsrfTokenDirect } from "@/util/csrf";

export default function Welcome() {

    const router = useRouter();
    const toast = useRef(null);



    return (
        <>
            <div className={style.container}>
                <div className={style.left_container}>
                    <Image alt="logo" src="/images/logo-aftrip.png" />
                    <Stepper activeStep={0} linear className={style.stepper}>
                        <StepperPanel></StepperPanel>
                        <StepperPanel></StepperPanel>
                        <StepperPanel></StepperPanel>
                        <StepperPanel></StepperPanel>
                    </Stepper>
                </div>

                <div className={style.right_container}>
                    <div className={style.top_container}>
                        <span className={style.top_title}>Create your etablissement account</span>
                        <span className={style.top_subtitle}>Please enter your entreprise email to begin first</span>
                    </div>
                    <div className={style.center}>

                        <div className={style.center}>
                            <h1 className={style.welcome}><span>Welcome To Aftrip</span></h1>
                            <p>Please check your email</p>
                            <Button style={{ width: "60%" }} type="submit" className="button-primary" onClick={() => { router.push("/users/etablissement/login") }} label="LogIn here" />

                        </div>
                    </div>
                </div>
            </div>
            <Toast ref={toast} />
        </>
    )
}

Welcome.getLayout = function getLayout(page) {
    return (
        <>
            <Head>
                <title>Aftrip</title>
            </Head>
            <AppTopbar />
            {page}
        </>
    )
}