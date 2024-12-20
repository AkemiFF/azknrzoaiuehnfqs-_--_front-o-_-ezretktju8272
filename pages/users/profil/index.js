import ProfileSkeleton from "@/components/ProfileSkeleton";
import UserProfilMenu from "@/components/UserProfilMenu";
import AppTopbar from "@/layouts/AppTopbar";
import style from '@/style/pages/users/Profile.module.css';
import { FetchUser } from "@/util/Cart";
import UrlConfig from "@/util/config";
import Head from "next/head";
import Link from "next/link";
import { Avatar } from "primereact/avatar";
import { useEffect, useState } from "react";

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        username: "",
        adresse: "",
        ville: "",
        numero_client: "",
        biographie: "",
        profilPic: ""
    });

    useEffect(() => {
        setLoading(true);
        FetchUser()
            .then((data) => {
                setUserInfo(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching user info:', error);
                setLoading(false);
            });
    }, []);

    return (
        <div className={style.container}>
            <UserProfilMenu active="Profil" />
            <div className={style.profil_container}>
                <Link href={"/users"} className={style.back}><i className="pi pi-arrow-left" /> Back</Link>
                {loading ? (
                    <ProfileSkeleton />
                ) : (
                    <>
                        <div className={style.profil_image_container}>
                            <div className={style.profil_image_wrapper}>
                                <Avatar
                                    label={userInfo?.first_name[0]}
                                    shape="circle"
                                    alt="user"
                                    className={style.profil_image}
                                    image={userInfo?.profilPic ? `${UrlConfig.apiBaseUrl}${userInfo?.profilPic}` : ""}
                                />
                                <div className={style.profil_user_info}>
                                    <span className={style.profil_username}>{userInfo?.username}</span>
                                    <span className={style.profil_adresse}>
                                        <span>Account ID :</span>
                                        <span>#{userInfo?.id}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className={style.separateur}></div>
                        <div className={style.profil_detail_container}>
                            <div className={style.profil_detail}>
                                <span className={style.title}>Personal information</span>
                                <div className={style.profil}>
                                    <div className={style.detail}>
                                        <span className={style.label}>First name</span>
                                        <span>{userInfo?.first_name}</span>
                                    </div>
                                    <div className={style.detail}>
                                        <span className={style.label}>Last name</span>
                                        <span>{userInfo?.last_name}</span>
                                    </div>
                                    <div className={style.detail}>
                                        <span className={style.label}>Email</span>
                                        <span>{userInfo?.email}</span>
                                    </div>
                                    <div className={style.detail}>
                                        <span className={style.label}>Contact</span>
                                        <span>{userInfo?.numero_client}</span>
                                    </div>
                                    <div className={style.detail}>
                                        <span className={style.label}>Address</span>
                                        <span>{userInfo?.adresse}</span>
                                    </div>
                                    <div className={style.detail}>
                                        <span className={style.label}>City</span>
                                        <span>{userInfo?.ville}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

Profile.getLayout = function getLayout(page) {
    return (
        <>
            <Head>
                <title>User profile</title>
            </Head>
            <AppTopbar />
            {page}
        </>
    );
}

