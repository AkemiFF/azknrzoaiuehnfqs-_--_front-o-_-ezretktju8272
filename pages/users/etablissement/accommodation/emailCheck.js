import { getCsrfTokenDirect } from '@/util/csrf';
import Link from 'next/link';
import { Toast } from 'primereact/toast';
import { useEffect, useRef, useState } from 'react';
import { InputOtp } from 'primereact/inputotp';
import { UrlConfig } from '@/util/config';

import AppTopbar from "@/layouts/AppTopbar";
import Head from "next/head";
import style from '@/style/pages/users/etablissement/etablissement.module.css';
import { Stepper } from "primereact/stepper";
import { Image } from "primereact/image";
import { StepperPanel } from "primereact/stepperpanel";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import WaitSpinner from '@/components/WaitSpinner';


export default function Verify() {

    const router = useRouter();
    const toast = useRef(null);
    const [timer, setTimer] = useState(0);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isSubmitDisabled, setSubmitDisabled] = useState(true);
    const [isInputDisabled, setIsInputDisabled] = useState(false);
    const [locate, setLocate] = useState();
    const [isSpinnerVisible, setIsSpinnerVisible] = useState(false);


    const [email, setEmail] = useState("");
    const [code, setCode] = useState();

    const inputCode = useRef(null);
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedLocation = localStorage.getItem("info_location");
            if (storedLocation) {
                setLocate(JSON.parse(storedLocation));
            }
        }
    }, []);
    const CreateResponsableUser = async (data) => {
        try {
            const response = await fetch(`${UrlConfig.apiBaseUrl}/api/accounts/responsables/create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const data = await response.json();
                return data
            } else {
                console.error("Erreur lors de l'enregistrement:", response.statusText);
            }
        } catch (error) {
            console.error("Erreur de requête:", error);
        }
    }
    const CreateLocation = async (data) => {
        try {
            const response = await fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/localisation/create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return true;
        } catch (error) {
            console.error('Error:', error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Localisation can't be set",
                life: 5000
            });
            return false;
        }
    };

    const CreateHebergemet = async (data) => {
        try {
            const response = await fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/create-hebergement/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error("Erreur lors de l'enregistrement: " + response.statusText);
            }
            const data_1 = await response.json();
            return data_1;
        } catch (error) {
            console.error("Erreur de requête:", error);
            return false;
        }
    }
    const createAllEntities = async () => {
        try {
            const type_etablissement = localStorage.getItem("type_etablissement");
            const accommodation_info = JSON.parse(localStorage.getItem("accommodationInfo"));
            const addressParts = locate.adress.split(',');
            const city = addressParts[addressParts.length - 2].trim();
            let userInfo = JSON.parse(localStorage.getItem("_dfqaccess404"));

            // Créer l'utilisateur responsable
            const responsable = await CreateResponsableUser(userInfo);
            if (!responsable.id) throw new Error("Création de l'utilisateur responsable échouée.");

            accommodation_info.responsable_id = responsable.id;

            // Créer l'hébergement
            const hebergement = await CreateHebergemet(accommodation_info);
            if (!hebergement) throw new Error("Création de l'hébergement échouée.");

            const locate_data = {
                "adresse": locate.adress,
                "ville": city,
                "latitude": locate.location.lat,
                "longitude": locate.location.lng,
                "hebergement_id": hebergement.id_hebergement
            };

            // Créer la localisation
            const locationCreated = await CreateLocation(locate_data);
            if (!locationCreated) throw new Error("Création de la localisation échouée.");


            // if (!locationCreated) throw new Error("Création de la localisation échouée.");

            // Stocker les informations dans le localStorage
            const responsable_info = {
                username: responsable.username,
                job_post: "Manager",
                id_etablissement: hebergement.id_hebergement,
                type_etablissement: type_etablissement
            };
            localStorage.setItem("responsable_info", JSON.stringify(responsable_info));

            return true;

        } catch (error) {
            console.error("Erreur lors de la création des entités :", error);
            toast.current.show({
                severity: "error",
                summary: "Erreur",
                detail: error.message || "Une erreur s'est produite lors de la création.",
                life: 5000
            });
            return false;
        }
    };

    const CleanStorage = async () => {

        localStorage.setItem("email_responsable", localStorage.getItem("email_etablissement"));


        localStorage.removeItem("userInfo");
        localStorage.removeItem("_dfqaccess404");
        localStorage.removeItem("type_etablissement");
        localStorage.removeItem("formData");
        localStorage.removeItem("email_etablissement");

        setTimeout(() => {
            setIsSpinnerVisible(false);
            router.push('/users/etablissement/tour/addImage');
        }, 1000);

    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (localStorage.getItem("timer")) {
                setTimer(localStorage.getItem("timer"));
                setIsButtonDisabled(true);
            }
        }
        setEmail(sessionStorage.getItem("email_in_signup"));
    }, [])

    useEffect(() => {
        let interval;
        if (isButtonDisabled) {
            interval = setInterval(() => {
                setTimer((prevTimer) => {
                    localStorage.setItem("timer", prevTimer);
                    if (prevTimer <= 1) {
                        localStorage.removeItem("timer");
                        clearInterval(interval);
                        setIsButtonDisabled(false);
                        return 0;
                    }
                    return prevTimer - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isButtonDisabled])



    // const handleSubmit = async () => {
    //     setSubmitDisabled(true);
    //     setIsInputDisabled(true);
    //     setIsSpinnerVisible(true);

    //     const email = localStorage.getItem("email_etablissement");

    //     console.log(code, email);
    //     try {
    //         const response = await fetch(`${UrlConfig.apiBaseUrl}/api/accounts/verify-code/`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ email: email, code: code }),
    //         });

    //         const data = await response.json();
    //         console.log(data);
    //         if (response.ok) {
    //             toast.current.show({
    //                 severity: 'success',
    //                 summary: 'Success',
    //                 detail: 'Verification code is correct',
    //                 life: 3000
    //             });

    //             LoadData().then(() => {
    //                 setTimeout(() => {
    //                     setIsSpinnerVisible(false);
    //                     router.push('/users/etablissement/accommodation/addImage');
    //                 }, 1000);
    //             })
    //         } else {

    //             toast.current.show({
    //                 severity: 'error',
    //                 summary: 'Error',
    //                 detail: data.error || 'Verification code is incorrect',
    //                 life: 5000
    //             });
    //             setTimeout(() => {
    //                 setIsInputDisabled(false);
    //                 setIsSpinnerVisible(false);
    //                 setSubmitDisabled(false);
    //             }, 5000);
    //         }
    //     } catch (error) {
    //         toast.current.show({
    //             severity: 'error',
    //             summary: 'Error',
    //             detail: 'An error occurred: ' + error.message,
    //             life: 3000
    //         }); setTimeout(() => {
    //             setSubmitDisabled(false);
    //             setIsSpinnerVisible(false);
    //             setIsInputDisabled(false);
    //         }, 3000);
    //     }
    // };
    const handleSubmit = async () => {
        try {
            setSubmitDisabled(true);
            setIsInputDisabled(true);
            setIsSpinnerVisible(true);

            const email = localStorage.getItem("email_etablissement");
            const response = await fetch(`${UrlConfig.apiBaseUrl}/api/accounts/verify-code/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Le code de vérification est correct',
                    life: 3000
                });

                const success = await createAllEntities();
                if (success) {
                    setIsSpinnerVisible(false);
                    CleanStorage();
                    setTimeout(() => {
                        router.push('/users/etablissement/accommodation/addImage');
                    }, 2000);
                } else {
                    setIsSpinnerVisible(false);
                    setSubmitDisabled(false);
                    setIsInputDisabled(false);
                }
            } else {
                throw new Error(data.error || 'Le code de vérification est incorrect');
            }
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Erreur',
                detail: `Une erreur s'est produite : ${error.message}`,
                life: 3000
            });
            setSubmitDisabled(false);
            setIsSpinnerVisible(false);
            setIsInputDisabled(false);
        }
    };

    const sendNewCode = async (email) => {
        try {
            const csrfToken = await getCsrfTokenDirect();
            const response = await fetch(`${UrlConfig.apiBaseUrl}/api/accounts/send-responsable-code/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'X-CSRFToken': csrfToken,
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error("Failed to send password reset email.");
            }

            toast.current.show({
                severity: "info",
                summary: "Info",
                detail: "Email de vérification renvoyé",
                life: 3000,
            });

        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to send verification email. Please try again later.',
                life: 3000
            });
        }
    };
    const resend = async (e) => {
        const email = localStorage.getItem("email_etablissement");

        sendNewCode(email);
        setIsButtonDisabled(true);
        setTimer(30);
    }



    const tapeCode = (e) => {
        setCode(e.value);
        if (e.value.length >= 6) {
            setSubmitDisabled(false);
        }
        if (e.value.length < 6) {
            setSubmitDisabled(true);
        }
    }


    return (
        <>
            <div className={style.container}>
                <div className={style.left_container}>
                    <Image alt="logo" src="/images/logo-aftrip.png" width={100} height={50} />
                    <Stepper activeStep={3} linear className={style.stepper}>
                        <StepperPanel></StepperPanel>
                        <StepperPanel></StepperPanel>
                        <StepperPanel></StepperPanel>
                        <StepperPanel></StepperPanel>
                    </Stepper>
                </div>
                <div className={style.right_container}>
                    <div className={style.top_container}>
                        <span className={style.top_title}>Check your email</span>
                        <span className={style.top_subtitle}>We sent a verification PIN code <br />to <span style={{ fontWeight: 700 }}>{email}</span>.Paste the PIN Code you<br /> received on the mail to below. </span>
                    </div>
                    <div className={style.image_parent}>

                        <div className={style.form_group}>
                            <div className={style.form_group_input}>
                                <span className={style.form_label}>Verification code</span>
                                <InputOtp disabled={isInputDisabled} value={code} onChange={tapeCode} length={6} integerOnly />
                            </div>
                        </div> <div className={style.button_group}>
                            <Button onClick={resend} text disabled={isButtonDisabled} icon="pi pi-refresh" label='Resend code' iconPos='right' className={style.resend_button} />
                        </div>
                    </div>

                    <span className={style.timer}>{timer == 0 ? "" : `Please wait ${timer} seconds before resending.`}</span>

                    <Button onClick={handleSubmit} className="button-primary" disabled={isSubmitDisabled} label="Continue" />
                </div>
            </div>
            <WaitSpinner visible={isSpinnerVisible} />

            <Toast ref={toast} />
        </>

    )
}


Verify.getLayout = function getLayout(page) {
    return (
        <>
            <Head>
                <title>Verify your email</title>
            </Head>
            {page}
        </>
    );
}