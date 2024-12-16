import style from '@/style/pages/login.module.css'
import UrlConfig from '@/util/config';
import { getCsrfTokenDirect } from '@/util/csrf';
import { emailValid } from '@/util/verify';
import Cookies from 'js-cookie';
import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Image } from 'primereact/image';
import { Toast } from 'primereact/toast';
import { useEffect, useRef, useState } from 'react';
import { InputOtp } from 'primereact/inputotp';
import { Button } from 'primereact/button';
export default function Verify() {

    const handleSubmit = (e) => {
        e.preventDefault();

        getCsrfTokenDirect()
            .then(csrfToken => {
                const email = localStorage.getItem("email_user");
                console.log(email);

                return fetch(`${UrlConfig.apiBaseUrl}/api/accounts/verify-code/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken,
                    },
                    body: JSON.stringify({ email, code }),
                });
            })
            .then(response => response.json().then(data => ({ status: response.status, body: data })))
            .then(({ status, body }) => {
                if (status === 200) {
                    toast.success('Verification code is correct');
                    router.push('/users/register/create-password-manual/');
                } else {
                    toast.error(body.error || 'Verification code is incorrect');
                }
            })
            .catch(error => {
                toast.error('An error occurred: ' + error.message);
                console.error('Error:', error);
            });
    };

    const router = useRouter();
    const toast = useRef(null);
    const [timer, setTimer] = useState(0);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isInputDisabled, setIsInputDisabled] = useState(false);


    const [email, setEmail] = useState("");
    const [code, setCode] = useState();

    const inputCode = useRef(null);

    const resend = async (e) => {
        setIsButtonDisabled(true);
        setTimer(120);
    }

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

    const tapeCode = (e) => {
        setCode(e.value);
        if (e.value.length == 6) {
            const code_test = handleSubmit()
            if(code_test){
            setIsInputDisabled(true);
                router.push("/users/register/create-account")
            }
        }
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