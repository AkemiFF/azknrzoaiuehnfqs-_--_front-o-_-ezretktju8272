import SideBarMenu from "@/components/SideBarMenu";
import ResponsableLayoutContext from "@/layouts/context/responsableLayoutContext";
import UrlConfig from "@/util/config";
import { getResponsableAccessToken } from "@/util/Cookies";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { useContext, useEffect, useRef, useState } from "react";
import style from './../../../../style/pages/responsable/accommodation/setting.module.css';
import style_profile from "./../../../../style/pages/responsable/accommodation/setting/profil.module.css";
export default function Security() {

    const router = useRouter();
    const { user, setUser } = useContext(ResponsableLayoutContext);
    const toast = useRef(null);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');



    const [detailProfil, setDetailProfil] = useState(null);

    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);



    const menu = 3;
    async function FetchProfil(id_responsable) {
        const access = await getResponsableAccessToken();

        fetch(`${UrlConfig.apiBaseUrl}/api/accounts/detail-responsable/${id_responsable}/`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`,

            }
        })
            .then(response => response.json())
            .then(hotelData => {
                setDetailProfil(hotelData);
            })
            .catch(err => console.error('Erreur lors de la récupération des details des responsable:', err));
    }
    useEffect(() => {
        if (user) {
            FetchProfil(user.id);
        }
    }, [user]);

    const handleChangePass = async () => {
        try {
            const access = await getResponsableAccessToken();

            const response = await fetch(`${UrlConfig.apiBaseUrl}/api/accounts/responsable/password/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
            });

            const data = await response.json();

            if (response.ok) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Password Changed Successfully',
                    detail: 'Your password has been updated. You will be redirected shortly.',
                    life: 3000
                });

                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } else {
                throw new Error(data.message || 'An unknown error occurred.');
            }
        } catch (error) {
            console.error('Error:', error);

            // Toast personnalisé en fonction de l'erreur
            let errorMessage = 'Failed to change password.';
            if (error.message.includes('Unauthorized')) {
                errorMessage = 'Authorization failed. Please log in again.';
            } else if (error.message.includes('NetworkError')) {
                errorMessage = 'Network error. Please check your connection.';
            }

            toast.current.show({
                severity: 'error',
                summary: 'Password Change Failed',
                detail: errorMessage,
                life: 4000 // Durée légèrement plus longue pour les messages d'erreur
            });
        }
    };

    const validatePassword = () => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (newPassword !== confirmPassword) {
            // Afficher une erreur avec Toast
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'New Password and Confirm Password do not match.', life: 3000 });
            return false;
        }
        if (!passwordRegex.test(newPassword)) {
            // Afficher une erreur avec Toast
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.', life: 3000 });
            return false;
        }

        // toast.current.show({ severity: 'success', summary: 'Success', detail: 'Password is valid.', life: 3000 });
        return true;
    };
    const handleSave = async () => {

        if (validatePassword()) {
            console.log("Old Password:", oldPassword);
            console.log("New Password:", newPassword);
            await handleChangePass();

            setIsEditing(!isEditing);
        }

    }
    return (
        <>
            <Head>
                <title>Security</title>
            </Head>

            <div className={style.container}>
                <SideBarMenu menu={menu} />
                <div className={style_profile.detail_user_container}>
                    <div className={style_profile.detail_user_top_container}>
                        <span className={style.left_top_title}>Personnal information</span>
                        <hr />
                    </div>
                    <div className={style_profile.detail_user_body_container}>
                        <div className={style_profile.detail_user}>
                            <span className={style_profile.title}>First name</span>
                            {isEditingPersonal ? (
                                <input
                                    type="text"

                                    className={style_profile.input_edit}
                                    value={detailProfil?.first_name || ''}
                                    onChange={(e) => setDetailProfil({ ...detailProfil, first_name: e.target.value })}
                                />
                            ) : (
                                <span>{detailProfil?.first_name || 'No Name'}</span>
                            )}
                        </div>
                        <div className={style_profile.detail_user}>
                            <span className={style_profile.title}>Lasts name</span>
                            {isEditingPersonal ? (
                                <input
                                    type="text"
                                    className={style_profile.input_edit}

                                    value={detailProfil?.last_name || ''}
                                    onChange={(e) => setDetailProfil({ ...detailProfil, last_name: e.target.value })}
                                />
                            ) : (
                                <span>{detailProfil?.last_name || 'No Last name'}</span>
                            )
                            }
                        </div>
                        <div className={style_profile.detail_user}>
                            <span className={style_profile.title}>Email address</span>
                            {isEditingPersonal ? (
                                // <input
                                //     type="text"
                                //     value={detailProfil?.email || ''}
                                //     onChange={(e) => setDetailProfil({ ...detailProfil, email: e.target.value })}
                                // />
                                <span>{detailProfil?.email || 'No Email'}</span>
                            ) : (
                                <span>{detailProfil?.email || 'No Email'}</span>
                            )}
                        </div>
                        <div className={style_profile.detail_user}>
                            <span className={style_profile.title}>Phone number</span>
                            {isEditingPersonal ? (
                                <input
                                    type="text"
                                    className={style_profile.input_edit}

                                    value={detailProfil?.numero_responsable || ''}
                                    onChange={(e) => setDetailProfil({ ...detailProfil, numero_responsable: e.target.value })}
                                />
                            ) : (
                                <span>{detailProfil?.numero_responsable || 'No Number'}</span>
                            )}
                        </div>
                    </div>
                    <div className={style_profile.detail_user_top_container}>
                        <span className={style.left_top_title}>Password</span>
                        <hr />
                    </div>
                    <div className={style_profile.detail_user_body_container}>
                        <Button
                            text
                            icon="pi pi-pen-to-square"
                            raised
                            label="Change Password"
                            disabled={isEditing}
                            onClick={() => setIsEditing(!isEditing)}
                        />
                        <div className={style_profile.detail_user_body_container} style={{ flexDirection: "column" }}>
                            <div className={style_profile.detail_user}>
                                {isEditing ? (
                                    <>
                                        <span className={style_profile.title}>Old Password</span>
                                        <Password
                                            type="text"
                                            className={style_profile.input_edit}
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                        />
                                    </>
                                ) : null}
                            </div>

                            <div className={style_profile.detail_user}>
                                {isEditing ? (
                                    <>
                                        <span className={style_profile.title}>New Password</span>
                                        <Password
                                            type="text"
                                            className={style_profile.input_edit}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </>
                                ) : null}
                            </div>

                            <div className={style_profile.detail_user}>
                                {isEditing ? (
                                    <>
                                        <span className={style_profile.title}>Confirm Password</span>
                                        <Password
                                            type="text"
                                            className={style_profile.input_edit}
                                            hideIcon
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </>
                                ) : null}
                            </div>
                        </div>
                        {isEditing ? (

                            <Button
                                text
                                icon="pi pi-pen-to-square"
                                raised
                                label="Save Password"
                                disabled={!isEditing}
                                onClick={() => handleSave()}
                            />) : null}


                    </div>
                </div>
            </div>   <Toast ref={toast} />
        </>
    )
}