import GoogleButton from '@/components/button/GoogleButton';
import style from '@/style/pages/login.module.css';
import { getCsrfTokenDirect } from '@/util/csrf';
import { emailValid } from '@/util/verify';
import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Image } from 'primereact/image';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';
import GoogleSignupButton from '@/components/button/GoogleSignupButton';
import { UrlConfig } from '@/util/config';

export default function Register() {

    const router = useRouter();
    const toast = useRef(null);

    const [email, setEmail] = useState("");
    const emailInput = useRef(null);

    const [emailErreur, setEmailErreur] = useState(null);

    const sendVerificationEmail = async (email) => {
        try {
            const csrfToken = await getCsrfTokenDirect();
            const response = await fetch(`${UrlConfig.apiBaseUrl}/api/accounts/send-verification-code/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'X-CSRFToken': csrfToken,

                },
                body: JSON.stringify({ email }),
            });
            // const data = response.json()


            if (!response.ok) {
                throw new Error("Failed to send verification email.");
            }

            router.push("/users/register/verify-email");

        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to send verification email. Please try again later.",
                life: 5000
            });
        }
    };

    const checkEmailExists = async (e) => {
        // e.preventDefault();
        const csrfToken = await getCsrfTokenDirect();
        localStorage.setItem("email_user", email);


        try {
            const response = await fetch(`${UrlConfig.apiBaseUrl}/api/accounts/client/check-email/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'X-CSRFToken': csrfToken,
                },
                body: JSON.stringify({ email }),
            });


            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }

            const result = await response.json();

            if (result.exists) {
                toast.current.show({
                    severity: "info",
                    summary: "Info",
                    detail: <>
                        Email already exists. <Link href="/users/login">Login here</Link>.
                    </>,
                    life: 5000
                });
            } else {
                await sendVerificationEmail(email);
            }
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "An error occurred. Please try again later.",
                life: 5000
            });
            console.log(error)
        }
    };



    const register = async (e) => {
        e.preventDefault();
        let canSendData = true;
        if (email.trim() == "" || !emailValid(email)) {
            emailInput.current.className = style.form_input_erreur;
            setEmailErreur("Email required");
            canSendData = false;
        }
        if (canSendData) {
            sessionStorage.setItem("email_in_signup", email);
            const request = await checkEmailExists();
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
                    <Link className={style.back_link} href={"/users"}>
                        <i className='pi pi-arrow-left'/>
                        <span>Back</span>
                    </Link>
                    <div className={style.login_title_container}>
                        <span className={style.login_title}>Sign up</span>
                        <span className={style.login_title_label}>Welcome ! Please enter your details</span>
                    </div>
                    <GoogleSignupButton />

                    <div className={style.separateur_container}>
                        <div className={style.separateur}></div>
                        <span>or</span>
                        <div className={style.separateur}></div>
                    </div>

                    <div className={style.content}>
                        <form onSubmit={register} className={style.form}>
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

                            <div className={style.button_group}>
                                <button type='submit' className={style.login_button}>Sign up</button>
                            </div>
                        </form>
                        <div className={style.register_component}>
                            <span className={style.register_label}>You have alerady an account, </span>
                            <Link className={style.register_link} href={"/users/login"}>Sign in</Link>
                        </div>
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


Register.getLayout = function getLayout(page) {
    return (
        <>
            <Head>
                <title>Register</title>
            </Head>
            {page}
        </>
    );
}