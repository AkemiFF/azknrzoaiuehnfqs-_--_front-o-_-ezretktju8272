import AppTopbar from "@/layouts/AppTopbar";
import Head from "next/head";
import style from '@/style/pages/users/etablissement/etablissement.module.css';
import { Stepper } from "primereact/stepper";
import { Image } from "primereact/image";
import { StepperPanel } from "primereact/stepperpanel";
import { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
export default function AddInfoUser() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [contact, setContact] = useState('');
    const toast = useRef(null);
    const [countryCode, setCountryCode] = useState('+261');
    const [countryOptions, setCountryOptions] = useState();
    const router = useRouter();

    useEffect(() => {
        const fetchCountryCodes = async () => {
            try {
                const response = await fetch('/api/social/countryCodes');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCountryOptions(data);
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        fetchCountryCodes();
    }, []);


    const saveInfoToLocalStorage = () => {
        const userInfo = {
            first_name: firstName,
            last_name: lastName,
            username: `${firstName} ${lastName}`,
            adresse: address,
            ville: city,
            numero_responsable: `${countryCode}${contact}`
        };

        // Validation des champs requis
        if (!userInfo.first_name ||
            !userInfo.last_name ||
            !userInfo.adresse ||
            !userInfo.ville ||
            !contact) {

            toast.current.show({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez remplir tous les champs',
                life: 3000
            });
            return false;
        }

        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        return true;
    };

    const addInfoUserFini = () => {
        const status = saveInfoToLocalStorage();
        if (status) {
            router.push("/users/etablissement/addLocalisation");
        }
    };

    return (
        <div className={style.container}>

            <div className={style.left_container}>
                <Image alt="logo" src="/images/logo-aftrip.png" />
                <Stepper activeStep={3} linear className={style.stepper}>
                    <StepperPanel></StepperPanel>
                    <StepperPanel></StepperPanel>
                    <StepperPanel></StepperPanel>
                    <StepperPanel></StepperPanel>
                </Stepper>
            </div>
            <div className={style.right_container}>
                <div className={style.top_container}>
                    <span className={style.top_title}>Create your etablissement account</span>
                    <span className={style.top_subtitle}>Please enter your information about your accommodation manager on the plateform</span>
                </div>
                <div className={style.addInfo_parent}>
                    <FloatLabel>
                        <InputText
                            className={style.input}
                            id="input_first_name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <label style={{ display: "flex", alignItems: "center", gap: "8px" }} htmlFor="input_first_name">
                            <i className="pi pi-user" />
                            First Name
                        </label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputText
                            className={style.input}
                            id="input_last_name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <label style={{ display: "flex", alignItems: "center", gap: "8px" }} htmlFor="input_last_name">
                            <i className="pi pi-user" />
                            Last Name
                        </label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputText
                            className={style.input}
                            id="input_address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <label style={{ display: "flex", alignItems: "center", gap: "8px" }} htmlFor="input_address">
                            <i className="pi pi-user" />
                            Adresse
                        </label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputText
                            className={style.input}
                            id="input_city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                        <label style={{ display: "flex", alignItems: "center", gap: "8px" }} htmlFor="input_city">
                            <i className="pi pi-user" />
                            City
                        </label>
                    </FloatLabel>

                    <FloatLabel>
                        <Dropdown className={style.labelContactUser}
                            pt={{
                                trigger: { style: { display: "none", width: "100%" } }
                            }}
                            value={countryCode}
                            options={countryOptions}
                            onChange={(e) => setCountryCode(e.value)}
                            optionLabel="label"
                            optionValue="value"
                        />
                        <InputText
                            className={style.inputContactUser}
                            id="input_contact"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                        />
                        <label style={{ display: "flex", alignItems: "center", gap: "8px" }} htmlFor="input_contact">
                            <i className="pi pi-user" />
                            Contact
                        </label>
                    </FloatLabel>
                </div>
                <Button onClick={addInfoUserFini} className="button-primary" label="Continue" />


            </div>
            <Toast ref={toast} />
        </div>
    )
}

AddInfoUser.getLayout = function getLayout(page) {
    return (
        <>
            <Head>
                <title>Add Info user</title>
            </Head>
            <AppTopbar />
            {page}
        </>
    )
}