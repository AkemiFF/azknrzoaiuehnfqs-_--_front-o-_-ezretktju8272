import AppTopbar from "@/layouts/AppTopbar";
import Head from "next/head";
import style from '@/style/pages/users/etablissement/etablissement.module.css';
import { Stepper } from "primereact/stepper";
import { Image } from "primereact/image";
import { StepperPanel } from "primereact/stepperpanel";
import { useContext, useRef, useState } from "react";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import UrlConfig from "@/util/config";
import { Divider } from "@mui/material";
import stylePassword from '@/style/components/PasswordInput.module.css';
import { Password } from "primereact/password";
import { Toast } from 'primereact/toast';
import { getCsrfTokenDirect } from "@/util/csrf";
import WaitSpinner from "@/components/WaitSpinner";

export default function AddInfoConnexion() {
    const toast = useRef(null);
    const [isSpinnerVisible, setIsSpinnerVisible] = useState(false);

    const [password, setPassword] = useState();
    const passwordInput = useRef(null);
    const [passwordErreur, setPasswordErreur] = useState(null);

    const [confPassword, setConfPassword] = useState("");
    const [confPasswordErreur, setConfPasswordErreur] = useState(null);
    const confPasswordInput = useRef(null);

    const [checkLenght, setCheckLenght] = useState(false);
    const [checkUppercase, setCheckUppercase] = useState(false);
    const [checkLowercase, setCheckLowercase] = useState(false);
    const [checkNumber, setCheckNumber] = useState(false);
    const [checkSpecial, setCheckSpecial] = useState(false);

    const checkChacun = (password) => {
        setCheckLenght(password.length > 8);
        setCheckSpecial(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password));
        setCheckNumber(/\d/.test(password));
        setCheckUppercase(/[A-Z]/.test(password));
        setCheckLowercase(/[a-z]/.test(password));
    }
    const router = useRouter();
    const handleSubmit = async (e) => {
        e.preventDefault();
        let canSendData = true;
       
        if (!password) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Password required',
                life: 3000,
            });
            canSendData = false;
            return;
        }
        setIsSpinnerVisible(true);
        if (password.length < 8 || password.trim() == "") {
          

            passwordInput.current.className = style.form_input_erreur;
            setPasswordErreur("Password required");
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Strong password required',
                life: 3000,
            });
            canSendData = false;
        }
        if (confPassword != password) {
            confPasswordInput.current.className = style.form_input_erreur;
            setConfPasswordErreur("Password does not match");
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Password does not match',
                life: 3000,
            });
            canSendData = false;
        }
        if (canSendData) {
            toast.current.show({
                severity: 'info',
                summary: 'Info',
                detail: 'Please wait',
                life: 3000,
            });
            LoadData();
        } else {
            setTimeout(() => {
                setIsSpinnerVisible(false);
            }, 1000);


        }

    }

    const passwordInputHeader = <span className={stylePassword.header_container}>Pick a new password</span>;

    const sendVerification = (email) => {
        getCsrfTokenDirect()
            .then(csrfToken => {
                return fetch(`${UrlConfig.apiBaseUrl}/api/accounts/send-responsable-code/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'X-CSRFToken': csrfToken,
                    },
                    body: JSON.stringify({ email: email }),
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to send verification email.");
                }
                toast.current.show({
                    severity: "info",
                    summary: "Info",
                    detail: "Email de vérification envoyé",
                    life: 3000,
                });
                const type_etablissement = localStorage.getItem("type_etablissement");

                let rout = "";

                if (type_etablissement == 1) {
                    rout = "/users/etablissement/accommodation/emailCheck";
                } else if (type_etablissement == 2) {
                    rout = "/users/etablissement/handcraft/emailCheck";
                } else if (type_etablissement == 3) {
                    rout = "/users/etablissement/tour/emailCheck";
                }
                setTimeout(() => {
                    router.push(rout);
                }, 3000);
            })
            .catch(error => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Échec de l\'envoi de l\'email de vérification. Veuillez réessayer plus tard.',
                    life: 3000,
                });
                console.error('Erreur:', error);
            });
    }


    const LoadData = async () => {
        const email = localStorage.getItem("email_etablissement");

        if (email) {
            sendVerification(email);
        }

        let userInfo = localStorage.getItem("userInfo");

        userInfo = JSON.parse(userInfo);
        const type_etablissement = localStorage.getItem("type_etablissement");

        userInfo.password = password;
        userInfo.type_responsable = parseInt(type_etablissement);
        userInfo.email = email;
        localStorage.setItem("_dfqaccess404", JSON.stringify(userInfo));

    };

    const passwordInputFooter = (
        <>
            <Divider />
            <div className={stylePassword.check_wrapper}>
                <div className={stylePassword.check}>
                    <Image alt='check' imageClassName={stylePassword.check_logo} src={checkLenght ? "/images/auth/check_logo.svg" : "/images/auth/check_unknow.svg"} />
                    <span className={stylePassword.check_label}>Must be at least 8 characters</span>
                </div>
                <div className={stylePassword.check}>
                    <Image alt='check' imageClassName={stylePassword.check_logo} src={checkUppercase ? "/images/auth/check_logo.svg" : "/images/auth/check_unknow.svg"} />
                    <span className={stylePassword.check_label}>Must contain at least one uppercase character</span>
                </div>
                <div className={stylePassword.check}>
                    <Image alt='check' imageClassName={stylePassword.check_logo} src={checkLowercase ? "/images/auth/check_logo.svg" : "/images/auth/check_unknow.svg"} />
                    <span className={stylePassword.check_label}>Must contain at least one lowercase character</span>
                </div>
                <div className={stylePassword.check}>
                    <Image alt='check' imageClassName={stylePassword.check_logo} src={checkNumber ? "/images/auth/check_logo.svg" : "/images/auth/check_unknow.svg"} />
                    <span className={stylePassword.check_label}>Must contain at least one number</span>
                </div>
                <div className={stylePassword.check}>
                    <Image alt='check' imageClassName={stylePassword.check_logo} src={checkSpecial ? "/images/auth/check_logo.svg" : "/images/auth/check_unknow.svg"} />
                    <span className={stylePassword.check_label}>Must contain at least one special character</span>
                </div>
            </div>
        </>
    )
    return (
        <div className={style.container}>
            <WaitSpinner visible={isSpinnerVisible} />
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
                <div className={style.addInfoConnexion_parent}>

                    {/* <FloatLabel>
                        <InputText
                            className={style.input}
                            id="input_name"
                        />
                        <label style={{ display: "flex", alignItems: "center", gap: "8px" }} htmlFor="input_name">
                            <i className="pi pi-user" />
                            Email
                        </label>
                    </FloatLabel> */}

                    <FloatLabel>
                        <Password
                            ref={passwordInput}
                            className={style.input}
                            id="input_name"
                            type="password"
                            value={password}
                            header={passwordInputHeader}
                            footer={passwordInputFooter}
                            onChange={(e) => {
                                passwordInput.current.className = style.form_input;
                                setPassword(e.target.value)
                                setPasswordErreur(null);
                                checkChacun(e.target.value);
                            }}
                        />
                        <label style={{ display: "flex", alignItems: "center", gap: "8px" }} htmlFor="input_name">
                            <i className="pi pi-user" />
                            Password
                        </label>
                    </FloatLabel>

                    <FloatLabel>
                        <Password
                            ref={confPasswordInput}

                            className={style.input}
                            id="input_password"
                            type="password"
                            value={confPassword}
                            onChange={(e) => {
                                setConfPassword(e.target.value)
                                setConfPasswordErreur(null);
                            }}

                        />
                        <label style={{ display: "flex", alignItems: "center", gap: "8px" }} htmlFor="input_name">
                            <i className="pi pi-user" />
                            Confirm Password
                        </label>
                    </FloatLabel>
                </div>
                <Button onClick={handleSubmit} className="button-primary" label="Continue" />


            </div>
            <Toast ref={toast} />

        </div>
    )
}

AddInfoConnexion.getLayout = function getLayout(page) {
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