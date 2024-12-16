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


    const [email, setEmail] = useState("");
    const [code, setCode] = useState();

    const inputCode = useRef(null);


    const SendData = async (data) => {
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
    const CreateHebergemet = (data) => {
        return fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/create-hebergement/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erreur lors de l'enregistrement: " + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                return data;
            })
            .catch(error => {
                console.error("Erreur de requête:", error);
                return false;
            });
    }

    const LoadData = async () => {

        const type_etablissement = localStorage.getItem("type_etablissement");
        const accommodation_info = JSON.parse(localStorage.getItem("accommodationInfo"));


        let userInfo = localStorage.getItem("_dfqaccess404");
        userInfo = JSON.parse(userInfo);

        SendData(userInfo).then((data) => {
            if (data.id) {
                accommodation_info.responsable_id = data.id;
                const created = CreateHebergemet(accommodation_info).then((created) => {


                    if (created) {
                        toast.current.show({
                            severity: "success",
                            summary: "Success",
                            detail: "Accomodation created successfully",
                            life: 5000
                        });
                        localStorage.setItem("email_responsable", localStorage.getItem("email_etablissement"));
                        console.log("hebergement :", created);
                        const responsable_info = {
                            username: data.username,
                            job_post: "Manager",
                            id_etablissement: created.id_hebergement,
                            type_etablissement: type_etablissement
                        }
                        localStorage.setItem("responsable_info", JSON.stringify(responsable_info));

                        localStorage.removeItem("userInfo");
                        localStorage.removeItem("_dfqaccess404");
                        localStorage.removeItem("type_etablissement");
                        localStorage.removeItem("accommodationInfo");
                        localStorage.removeItem("email_etablissement");

                        // setTimeout(() => {
                        //     router.push("/users/etablissement/accommodation/addImage");
                        // }, 3000);

                    } else {
                        toast.current.show({
                            severity: "error",
                            summary: "Error",
                            detail: "Please try again later",
                            life: 5000
                        });
                    }
                })

            }
        })
    };

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



    const handleSubmit = async () => {
        setSubmitDisabled(true);
        setIsInputDisabled(true);

        const email = localStorage.getItem("email_etablissement");


        try {
            const response = await fetch(`${UrlConfig.apiBaseUrl}/api/accounts/verify-code/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, code: code }),
            });

            const data = await response.json();
            console.log(data);
            if (response.ok) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Verification code is correct',
                    life: 3000
                });

                LoadData().then(() => {
                    setTimeout(() => {
                        router.push('/users/etablissement/accommodation/addImage');
                    }, 3000);
                })
            } else {

                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: data.error || 'Verification code is incorrect',
                    life: 3000
                });
                setTimeout(() => {
                    setSubmitDisabled(false);
                }, 3000);
            }
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred: ' + error.message,
                life: 3000
            }); setTimeout(() => {
                setSubmitDisabled(false);
            }, 3000);
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
                    <Image alt="logo" src="/images/logo-aftrip.png" width={100} />
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
                    <WaitSpinner visible={false} />
                    <Button onClick={handleSubmit} className="button-primary" disabled={isSubmitDisabled} label="Continue" />
                </div>
            </div>
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