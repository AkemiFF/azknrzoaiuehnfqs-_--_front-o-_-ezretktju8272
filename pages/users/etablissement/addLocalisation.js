import Head from "next/head";
import style from './../../../style/pages/users/etablissement/etablissement.module.css';
import AppTopbar from "@/layouts/AppTopbar";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Image } from "primereact/image";
import { useRef, useState } from "react";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import { Toast } from "primereact/toast";
import SelectLocationMap from "@/components/SelectLocationMap";

export default function AddLocalisation() {
    const router = useRouter();
    const toast = useRef(null);

    const [location, setLocation] = useState(null);
    const [adress, setAdress] = useState(null);

    const handleLocationSelect = (location) => {
        setLocation(location);
    };

    const handleAddressChange = (adress) => {
        setAdress(adress);
    };
    const handleSubmit = () => {

        if (location && adress) {
            const info_location = {
                location: location,
                adress: adress
            }
            localStorage.setItem("info_location", JSON.stringify(info_location))

            setTimeout(() => {
                router.push("/users/etablissement/addInfoConnexion");
            }, 3000);
        } else {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please select a localisation on the map',
                life: 3000,
            });
        }
    }
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
                        <span className={style.top_subtitle}>Please select your etablissement location</span>
                    </div>
                    <div className={style.email_formulaire_container}>
                        <div className={style.form_group}>
                            <SelectLocationMap onLocationSelect={handleLocationSelect} onchangeAddress={handleAddressChange} />
                        </div>
                        <Button style={{ width: "60%" }} onClick={handleSubmit} type="submit" className="button-primary" label="Continue" />
                    </div>
                </div>
            </div>
            <Toast ref={toast} />
        </>
    )
}

AddLocalisation.getLayout = function getLayout(page) {
    return (
        <>
            <Head>
                <title>Add Localisation</title>
            </Head>
            <AppTopbar />
            {page}
        </>
    )
}