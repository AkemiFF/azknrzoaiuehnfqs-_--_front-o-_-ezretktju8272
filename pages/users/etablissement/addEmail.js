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
import WaitSpinner from "@/components/WaitSpinner";

export default function AddEmail() {

    const router = useRouter();
    const [email, setEmail] = useState("");
    const [isSpinnerVisible, setIsSpinnerVisible] = useState(false);
    const toast = useRef(null);

    const checkEmail = (email) => {
        return getCsrfTokenDirect().then((csrfToken) => {
            console.log(csrfToken);
            return fetch(`${UrlConfig.apiBaseUrl}/api/accounts/responsable-check-email/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                body: JSON.stringify({ email: email }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    return !data.exists;
                })
                .catch(error => {
                    console.error('Erreur:', error);
                    return false;
                });
        });
    };
    const registerEmail = (e) => {
        e.preventDefault();
        setIsSpinnerVisible(true);
        checkEmail(email).then((verification) => {
            if (verification) {
                toast.current.show({
                    severity: "info",
                    summary: "Info",
                    detail: "Veuillez patienter",
                    life: 4000
                });
                localStorage.setItem("email_etablissement", email);
                setIsSpinnerVisible(false);

                setTimeout(() => {
                    router.push("/users/etablissement/choixType");
                }, 4000);

            } else {
                setIsSpinnerVisible(false);

                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: (
                        <>
                            Cette email est déjà lié à un établissement, <br />veuillez vous connecter <br />
                            <span
                                onClick={() => router.push('/users/etablissement/login')}
                                style={{ cursor: "pointer", textDecoration: "underline" }}
                            >
                                connecter ici
                            </span>
                        </>
                    ),
                    life: 5000
                })

            }
        })
    }


    return (
        <>  <WaitSpinner visible={isSpinnerVisible} />
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
                    <form onSubmit={registerEmail} className={style.email_formulaire_container}>
                        <div className={style.form_group}>
                            <div className={style.form_group_input}>
                                <span className={style.form_label}>Email address or etablissement</span>
                                <input
                                    type="email"
                                    autoFocus={true}
                                    className={style.form_input}
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                    }}
                                    required
                                />
                            </div>
                        </div>
                        <Button style={{ width: "60%" }} type="submit" className="button-primary" label="Continue" />
                    </form>
                </div>
            </div>


            <Toast ref={toast} />
        </>
    )
}

AddEmail.getLayout = function getLayout(page) {
    return (
        <>
            <Head>
                <title>Add email</title>
            </Head>
            <AppTopbar />
            {page}
        </>
    )
}