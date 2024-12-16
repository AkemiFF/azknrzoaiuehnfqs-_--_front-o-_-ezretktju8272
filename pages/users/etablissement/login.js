import WaitSpinner from '@/components/WaitSpinner';
import LayoutContext from '@/layouts/context/layoutContext';
import ResponsableLayoutContext from '@/layouts/context/responsableLayoutContext';
import style from '@/style/pages/users/etablissement/login.module.css';
import { UrlConfig } from '@/util/config';

import { getCsrfTokenDirect } from '@/util/csrf';
import { emailValid } from '@/util/verify';
import Cookies from 'js-cookie';
import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Image } from 'primereact/image';
import { Toast } from 'primereact/toast';
import { useContext, useEffect, useRef, useState } from 'react';
export default function Login() {

    const router = useRouter();
    const toast = useRef(null);

    const { user, setUser } = useContext(ResponsableLayoutContext);

    const [email, setEmail] = useState("");
    const emailInput = useRef(null);
    const [password, setPassword] = useState("");
    const passwordInput = useRef(null);
    const [isSpinnerVisible, setIsSpinnerVisible] = useState(false);
    const [emailErreur, setEmailErreur] = useState(null);
    const [passwordErreur, setPasswordErreur] = useState(null);

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem("responsable_user"));
        if (user) {
            if (user.type_etablissement == 1) {
                router.push("/responsable/accommodation");
            } else if (user.type_etablissement == 2) {
                router.push("/responsable/handcraft");
            } else if (user.type_etablissement == 3) {
                router.push("/responsable/tour");
            } else {
                router.push("/users/etablissement/login");
            }
        }
    }, [router])

    const login = async (e) => {
        setIsSpinnerVisible(true);

        e.preventDefault();
        let canSendData = true;
        if (!password) {
            canSendData = false;
            setEmailErreur("Email required");
        }
        if (email.trim() == "" || !emailValid(email)) {
            emailInput.current.className = style.form_input_erreur;
            setEmailErreur("Email required");
            canSendData = false;
        }
        if (password.trim() == "") {
            passwordInput.current.className = style.form_input_erreur;
            setPasswordErreur("Password required");
            canSendData = false;
        }

        if (canSendData) {
            sendData();
        } else {
            setIsSpinnerVisible(false);
        }
    }

    const sendData = () => {
        let message = "Erreur de connexion";

        fetch(`${UrlConfig.apiBaseUrl}/api/accounts/responsable/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })
            .then((res) => {
                if (!res.ok) {
                    if (res.status == 404) {
                        setIsSpinnerVisible(false);

                        message = "Email unknow";
                    }
                    if (res.status == 401) {
                        message = "Wrong password\n Please wait"

                        setTimeout(() => {
                            setIsSpinnerVisible(false);
                        }, 4000);
                    } else {
                        setIsSpinnerVisible(false);
                    }
                }
                else {
                    return res.json();
                }
            })
            .then((data) => {
                if (data.access) {
                    Cookies.set('responsable_access_token', data.access, {
                        expires: 5 / (24 * 60),
                        secure: true,
                        sameSite: 'strict'
                    });
                }
                if (data.refresh) {
                    Cookies.set('responsable_refresh_token', data.refresh, {
                        expires: 1,
                        secure: true,
                        sameSite: 'strict'
                    });
                }

                if (data.type_etablissement == 1) {
                    setUser({
                        username: data.user.username,
                        id: data.user.id,
                        email: data.user.email,
                        type_etablissement: data.type_etablissement,
                        job_post: "Manager",
                        id_etablissement: data.etablissement_info.id,
                        nom_hebergement: data.etablissement_info.nom_hebergement,
                    })

                    PushUrl(data.type_etablissement);

                } else if (data.type_etablissement == 2) {
                    // router.push("/responsable/handcraft");
                    setUser({
                        username: data.user.username,
                        id: data.user.id,
                        email: data.user.email,
                        type_etablissement: data.type_etablissement,
                        job_post: "Manager",
                        id_etablissement: data.etablissement_info.id,
                        handcraft_name: data.etablissement_info.nom_hebergement,
                    })
                    PushUrl(data.type_etablissement);

                } else if (data.type_etablissement == 3) {
                    // router.push("/responsable/tour");
                    setUser({
                        username: data.user.username,
                        id: data.user.id,
                        email: data.user.email,
                        type_etablissement: data.type_etablissement,
                        job_post: "Manager",
                        id_etablissement: data.etablissement_info.id,
                        operator_name: data.etablissement_info.nom_hebergement,
                    })
                    PushUrl(data.type_etablissement);
                }




            })
            .catch((error) => {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: message,
                    life: 5000
                });
                console.log(error);

            })
    }
    const PushUrl = (type_etablissement) => {
        toast.current.show({
            severity: "info",
            summary: "Info",
            detail: "Connexion Réussi",
            life: 3000
        });
        setTimeout(() => {
            setIsSpinnerVisible(false);

            if (type_etablissement == 1) {
                router.push("/responsable/accommodation");
            } else if (type_etablissement == 2) {
                router.push("/responsable/handcraft");
            } else if (type_etablissement == 3) {
                router.push("/responsable/tour");
            } else {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "You do not have an etablishment",
                    life: 5000
                });
            }
        }, 2000);
    }

    return (
        <>
            <div className={style.container}>

                <div className={style.login_left}>
                    <Link href={"/users"}>
                        <Image src='/images/logo-aftrip.png' alt='logo' style={{ width: "250px" }} />
                    </Link>
                </div>
                <div className={style.login_right}>
                    <Link className={style.back_link} href={"/users"}>
                        <i className='pi pi-arrow-left' />
                        <span>Back</span>
                    </Link>
                    <div className={style.login_title_container}>
                        <span className={style.login_title}>Login to your etablissement <br />account</span><br />
                        <span className={style.login_title_label}>Welcome back! Please enter your details</span>
                    </div>


                    <div className={style.content}>
                        <form onSubmit={login} className={style.form}>
                            <div className={style.form_group}>
                                <div className={style.form_group_input}>
                                    <span className={style.form_label}>Email</span>
                                    <input
                                        ref={emailInput}
                                        type="email"
                                        autoFocus={true}
                                        className={style.form_input}
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => {
                                            emailInput.current.className = style.form_input;
                                            setEmail(e.target.value)
                                            setEmailErreur(null);
                                        }}
                                    />
                                    <Image style={emailErreur != null ? { display: "block" } : { display: "none" }} className={style.form_erreur_image} src="/images/auth/alert_circle.svg" alt="!" />
                                </div>
                                <span style={emailErreur != null ? { display: "block" } : { display: "none" }} className={style.form_erreur}>{emailErreur}</span>
                            </div>

                            <div className={style.form_group}>
                                <div className={style.form_group_input}>
                                    <span className={style.form_label}>Password</span>
                                    <input
                                        ref={passwordInput}
                                        type="password"
                                        className={style.form_input}
                                        placeholder="Enter your pasword"
                                        value={password}
                                        onChange={(e) => {
                                            passwordInput.current.className = style.form_input;
                                            setPassword(e.target.value)
                                            setPasswordErreur(null);
                                        }}
                                    />
                                    <Image style={passwordErreur != null ? { display: "block" } : { display: "none" }} className={style.form_erreur_image} src="/images/auth/alert_circle.svg" alt="!" />
                                </div>
                                <span style={passwordErreur != null ? { display: "block" } : { display: "none" }} className={style.form_erreur}>{passwordErreur}</span>
                            </div>

                            <br />

                            <div className={style.button_group}>
                                <button type='submit' className={style.login_button}>Sign in</button>
                            </div>
                            <div className={style.button_group}>
                                <Link href={"/users/login"} className={style.etablissment_button}>
                                    <span> Log in as an user? </span><i className='pi pi-arrow-right' />
                                </Link>
                            </div>
                        </form>
                        <div className={style.register_component}>
                            <span className={style.register_label}>Don&apos;t have an account ?</span>
                            <Link className={style.register_link} href={"/users/etablissement/addEmail"}>Sign up</Link>
                        </div>
                    </div>
                </div>




                <div className={style.footer}>
                    <span>Copyright 2024 - All rights reserved</span>
                    <Link style={{ color: "#000" }} href={"/users/privatePolicy"}>Pivate policy</Link>
                </div>

            </div>
            <WaitSpinner visible={isSpinnerVisible} />
            <Toast ref={toast} />
        </>
    )
}


Login.getLayout = function getLayout(page) {
    return (
        <>
            <Head>
                <title>Login etablissement</title>
            </Head>
            {page}
        </>
    );
}