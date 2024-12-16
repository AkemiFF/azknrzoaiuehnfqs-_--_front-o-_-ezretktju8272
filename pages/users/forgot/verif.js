import style from '@/style/pages/login.module.css'
import { getCsrfTokenDirect } from '@/util/csrf';
import { emailValid } from '@/util/verify';
import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Image } from 'primereact/image';
import { Toast } from 'primereact/toast';
import { useEffect, useRef, useState } from 'react';
import { InputOtp } from 'primereact/inputotp';
import { Button } from 'primereact/button';
import { UrlConfig } from '@/util/config';
import { useNavigation } from '@/layouts/context/navigation';
import { NavigationProvider } from '@/layouts/context/navigation';

export default function Verify() {

    const router = useRouter();
    const toast = useRef(null);
    const [timer, setTimer] = useState(0);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isSubmitDisabled, setSubmitDisabled] = useState(false);
    const [isInputDisabled, setIsInputDisabled] = useState(false);


    const [email, setEmail] = useState("");
    const [code, setCode] = useState();

    const inputCode = useRef(null);

    const { canAccessForgotPage, setCanAccessForgotPage } = useNavigation();

    useEffect(() => {
        if (!canAccessForgotPage) {
            router.push('/user/login');
        }
    }, [canAccessForgotPage, router, setCanAccessForgotPage]);

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

    if (!canAccessForgotPage) {
        return null;
    }

    const handleSubmit = async () => {
        setSubmitDisabled(true);

        const csrfToken = await getCsrfTokenDirect();
        const email = localStorage.getItem("email_user");

        try {
            const response = await fetch(`${UrlConfig.apiBaseUrl}/api/accounts/verify-code/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                body: JSON.stringify({ email, code }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Verification code is correct',
                    life: 3000
                });
                localStorage.setItem("qfdhoiamlfndksqofmanlfdsnkzlfkqsd", code)
                setCanAccessForgotPage(true);

                setTimeout(() => {
                    router.push('/users/forgot/newPassword');
                }, 3000);
            } else {

                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: data.error || 'Verification code is incorrect',
                    life: 3000
                }); setTimeout(() => {
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
            const response = await fetch(`${UrlConfig.apiBaseUrl}/api/accounts/send-recovery-code/`, {
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
                severity: 'success',
                summary: 'Success',
                detail: 'Password reset email sent. Please check your inbox.',
                life: 3000
            });

            setTimeout(() => {
                router.push('/users/forgot/verif');
            }, 3000);
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to send password reset email. Please try again later.',
                life: 3000
            });
        }
    };
    const resend = async (e) => {
        const email = localStorage.getItem("email_user");

        sendNewCode(email);
        setIsButtonDisabled(true);
        setTimer(60);
    }



    const tapeCode = (e) => {
        setCode(e.value);
        if (code) {
            if (code.length == 6) {
                const verify_code = handleSubmit();
                if (verify_code) {
                    setIsInputDisabled(true);
                    // router.push("/users/register/create-account")
                } else (console.error(verify_code))
            }
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
                        <span className={style.login_title}>Check your email</span>
                        <span className={style.login_title_label}>We sent a verification PIN code <br />to <span style={{ fontWeight: 700 }}>{email}</span>.Paste the PIN Code you<br /> received on the mail to below. </span>
                    </div>

                    <div className={style.content}>
                        <div className={style.form}>
                            <div className={style.form_group}>
                                <div className={style.form_group_input}>
                                    <span className={style.form_label}>Verification code</span>
                                    <InputOtp disabled={isInputDisabled} value={code} onChange={tapeCode} length={6} integerOnly />
                                </div>
                            </div>

                            <div className={style.button_group}>
                                <Button onClick={resend} text disabled={isButtonDisabled} icon="pi pi-refresh" label='Resend code' iconPos='right' className={style.resend_button} />
                                <span className={style.timer}>{timer == 0 ? "" : `Please wait ${timer} seconds before resending.`}</span>
                            </div>
                            <div className={style.button_group}>
                                <button type='submit' className={style.login_button} disabled={isSubmitDisabled} onClick={handleSubmit}>Continue</button>
                            </div>
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