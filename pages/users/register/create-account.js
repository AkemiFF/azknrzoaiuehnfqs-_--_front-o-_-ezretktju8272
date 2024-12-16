import style from '@/style/pages/login.module.css'
import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Image } from 'primereact/image';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import { useContext, useRef, useState } from 'react';
import stylePassword from '@/style/components/PasswordInput.module.css';
import { Divider } from 'primereact/divider';
import { UrlConfig } from '@/util/config';
import { custom_login, getCsrfTokenDirect } from '@/util/csrf';
import LayoutContext from '@/layouts/context/layoutContext';
export default function CreateAccount() {

    const router = useRouter();
    const toast = useRef(null);


    const [username, setUsername] = useState("");
    const usernameInput = useRef(null);
    const [usernameErreur, setUsernameErreur] = useState(null);

    const [password, setPassword] = useState("");
    const passwordInput = useRef(null);
    const [passwordErreur, setPasswordErreur] = useState(null);

    const [confPassword, setConfPassword] = useState("");
    const [confPasswordErreur, setConfPasswordErreur] = useState(null);
    const confPasswordInput = useRef(null);

    //
    const [checkLenght, setCheckLenght] = useState(false);
    const [checkUppercase, setCheckUppercase] = useState(false);
    const [checkLowercase, setCheckLowercase] = useState(false);
    const [checkNumber, setCheckNumber] = useState(false);
    const [checkSpecial, setCheckSpecial] = useState(false);
    const { user, setUser } = useContext(LayoutContext);
    const checkChacun = (password) => {
        setCheckLenght(password.length > 8);
        setCheckSpecial(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password));
        setCheckNumber(/\d/.test(password));
        setCheckUppercase(/[A-Z]/.test(password));
        setCheckLowercase(/[a-z]/.test(password));
    }
    const createClient = async (password) => {
        const csrfToken = await getCsrfTokenDirect();
        const email = sessionStorage.getItem("email_in_signup")
        fetch(`${UrlConfig.apiBaseUrl}/api/accounts/client/create-with-username/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({ email, username, password }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to create client');
                }

                custom_login(username, password)
                return response.json();

            }).then(data => {
                setUser({
                    id: data.id,
                    username: username,
                    userImage: data.emailPhotoUrl
                });
            })
            .then(() => {
                fetch(`${UrlConfig.apiBaseUrl}/api/accounts/welcome-mail/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken,
                    },
                    body: JSON.stringify({ email }),
                })
                    .then(res => {
                        if (!res.ok) {
                            throw new Error('Failed to send welcome email');
                        }
                        return res.json();
                    })
                    .then(data => {

                        sessionStorage.removeItem("email_in_signup");
                        router.push('/');
                    })
                    .catch(error => {
                        console.log('Error sending welcome email:', error);
                    });
            })
            .catch(error => {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: 'An error occurred: ' + error.message,
                    life: 5000
                });
            });

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let canSendData = true;
        if (username.trim() == "") {
            usernameInput.current.className = style.form_input_erreur;
            setUsernameErreur("Username required");
            canSendData = false;
        }
        if (password.length < 8 || password.trim() == "") {
            passwordInput.current.className = style.form_input_erreur;
            setPasswordErreur("Password required");
            canSendData = false;
        }
        if (confPassword != password) {
            confPasswordInput.current.className = style.form_input_erreur;
            setConfPasswordErreur("Password does not match");
            canSendData = false;
        }
        if (canSendData) {
            const creat = await createClient(password)
        }

    }

    const passwordInputHeader = <span className={stylePassword.header_container}>Pick a new password</span>;

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
                        <span className={style.login_title}>Create a new password</span>
                        <span className={style.login_title_label}>You are almost threre</span>
                    </div>

                    <div className={style.content}>
                        <form onSubmit={handleSubmit} className={style.form}>
                            <div className={style.form_group}>
                                <div className={style.form_group_input}>
                                    <span className={style.form_label}>Username</span>
                                    <input
                                        ref={usernameInput}
                                        type="text"
                                        className={style.form_input}
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) => {
                                            usernameInput.current.className = style.form_input;
                                            setUsername(e.target.value)
                                            setUsernameErreur(null);
                                        }}
                                    />
                                    <Image style={confPasswordErreur != null ? { display: "block" } : { display: "none" }} className={style.form_erreur_image} src="/images/auth/alert_circle.svg" alt="!" />
                                </div>
                                <span style={usernameErreur != null ? { display: "block" } : { display: "none" }} className={style.form_erreur}>{usernameErreur}</span>
                            </div>

                            <div className={style.form_group}>
                                <div className={style.form_group_input}>
                                    <span className={style.form_label}>Password</span>
                                    <Password
                                        ref={passwordInput}
                                        inputClassName={style.form_input_password}
                                        className={style.form_input_password_container}
                                        placeholder="Enter your pasword"
                                        value={password}
                                        toggleMask
                                        header={passwordInputHeader}
                                        footer={passwordInputFooter}
                                        onChange={(e) => {
                                            passwordInput.current.className = style.form_input;
                                            setPassword(e.target.value)
                                            setPasswordErreur(null);
                                            checkChacun(e.target.value);
                                        }}
                                    />
                                </div>
                                <span style={passwordErreur != null ? { display: "block" } : { display: "none" }} className={style.form_erreur}>{passwordErreur}</span>
                            </div>

                            <div className={style.form_group}>
                                <div className={style.form_group_input}>
                                    <span className={style.form_label}>Confirm password</span>
                                    <input
                                        ref={confPasswordInput}
                                        type="password"
                                        className={style.form_input}
                                        placeholder="Confirm your pasword"
                                        value={confPassword}
                                        onChange={(e) => {
                                            confPasswordInput.current.className = style.form_input;
                                            setConfPassword(e.target.value)
                                            setConfPasswordErreur(null);
                                        }}
                                    />
                                    <Image style={confPasswordErreur != null ? { display: "block" } : { display: "none" }} className={style.form_erreur_image} src="/images/auth/alert_circle.svg" alt="!" />
                                </div>
                                <span style={confPasswordErreur != null ? { display: "block" } : { display: "none" }} className={style.form_erreur}>{confPasswordErreur}</span>
                            </div>

                            <div className={style.button_group}>
                                <button type='submit' className={style.login_button}>Register</button>
                            </div>
                        </form>
                        <div className={style.register_component}>
                            <Link className={style.register_link} href={"/users/login"}>
                                <i className="pi pi-angle-left" /> Back to Login
                            </Link>
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


CreateAccount.getLayout = function getLayout(page) {
    return (
        <>
            <Head>
                <title>Create an account</title>
            </Head>
            {page}
        </>
    );
}