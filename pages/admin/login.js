import AdminLayoutContext from '@/layouts/context/adminLayoutContext';
import style from '@/style/pages/login.module.css'
import { UrlConfig } from '@/util/config';
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


    const { user, setUser } = useContext(AdminLayoutContext);


    useEffect(() => {
        if (user != null) {
            router.push("/admin");
        }
    }, [router, user])



    const [email, setEmail] = useState("");
    const emailInput = useRef(null);
    const [password, setPassword] = useState("");
    const passwordInput = useRef(null);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [emailErreur, setEmailErreur] = useState(null);
    const [passwordErreur, setPasswordErreur] = useState(null);

    const login = async (e) => {
        e.preventDefault();
        setButtonDisabled(true);
        let canSendData = true;
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
            // const csrfToken =  await getCsrfTokenDirect();
            fetch(`${UrlConfig.apiBaseUrl}/api/log/admin/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            })
                .then((res) => {
                    if (!res.ok) {
                        let message;
                        if (res.status == 404) {
                            message = "Email unknow";
                        }
                        if (res.status == 401) {
                            message = "Wrong password"
                        }
                        toast.current.show({
                            severity: "error",
                            summary: "Error",
                            detail: message,
                            life: 5000
                        })
                        setTimeout(() => {
                            setButtonDisabled(false);
                        }, 3000);
                    }
                    else {
                        return res.json();
                    }
                })
                .then((data) => {
                    if (data.is_admin) {
                        if (data.access) {
                            Cookies.set('isthisanotherpaimon', data.access, {
                                expires: 5 / 1440,
                                secure: true,
                                sameSite: 'Strict'
                            });
                        }
                        if (data.refresh) {
                            Cookies.set('yesthisisanotherpaimon', data.refresh, {
                                expires: 1,
                                secure: true,
                                sameSite: 'strict'
                            });
                        }
                        toast.current.show({
                            severity: "info",
                            summary: "Info",
                            detail: "Veuillez patientez",
                            life: 3000
                        })

                        setTimeout(() => {
                            setUser({
                                username: data.user.username,
                                id: data.user.id,
                                email: data.user.email
                            })
                        }, 3000);

                    } else {
                        // console.log("not admin");
                        router.push("/users/login");
                    }

                })
                .catch((error) => {
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: "Erreur de connexion",
                        life: 5000
                    });
                    console.log(error);
                })
        }

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
                    <div className={style.login_title_container}>
                        <span className={style.login_title}>Login admin</span>
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

                            <div className={style.button_group}>
                                <button type='submit' disabled={buttonDisabled} className={style.login_button}>Sign in</button>
                            </div>
                        </form>
                    </div>
                </div>




                <div className={style.footer}>
                    <span>Copyright 2024 - All rights reserved</span>
                    <Link style={{ color: "#000" }} href={"/users/privatePolicy"}>Pivate policy</Link>
                </div>

            </div>
            <Toast ref={toast} />
        </>
    )
}


Login.getLayout = function getLayout(page) {
    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            {page}
        </>
    );
}