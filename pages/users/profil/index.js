import Head from "next/head";
import style from '@/style/pages/users/Profile.module.css';
import Link from "next/link";
import { Avatar } from "primereact/avatar";
import { TabPanel, TabView } from "primereact/tabview";
import { Button } from "primereact/button";
import AppTopbar from "@/layouts/AppTopbar";
import { useContext, useEffect, useRef, useState } from "react";
import { FetchUser } from "@/util/Cart";

import LayoutContext from "@/layouts/context/layoutContext";
import UrlConfig from "@/util/config";
import { getNewAccess } from "@/util/Cookies";
import Cookies from "js-cookie";
import { Toast } from "primereact/toast";

export default function Profile() {
    const [userInfo, setUserInfo] = useState(null);
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [username, setUsername] = useState("");
    const [adresse, setAdresse] = useState("");
    const [accId, setId] = useState("");
    const [email, setEmail] = useState("");
    const [numero, setNumero] = useState("");
    const [bio, setBio] = useState("");
    const toast = useRef(null);
    const [profilePic, setProfilePic] = useState("");
    const [file, setFile] = useState();
    const [userProfil, setUsedProfil] = useState("");
    const { user, setUser } = useContext(LayoutContext);
    const [city, setCity] = useState("dsfsd");
    const [edit, setEdit] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setEdit(true);
                setProfilePic(reader.result);
                setUsedProfil(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    useEffect(() => {
        FetchUser()
            .then((data) => {
                setUserInfo(data);
                setId(data.id)
                setFirstname(data.first_name);
                setLastname(data.last_name);
                setEmail(data.email);
                setUsername(data.username);
                setAdresse(data.adresse);
                setCity(data.ville);
                setNumero(data.numero_client);
                setBio(data.biographie);
                setProfilePic(`${UrlConfig.apiBaseUrl}${data.profilPic}`);
                setUsedProfil(`${UrlConfig.apiBaseUrl}${data.profilPic}`);

            })
            .catch((error) => {
                console.error('Error fetching user info:', error);
            });
    }, []);

    const panelClassName = (parent, index) => {
        if (parent.state.activeIndex === index)
            return style.tab_active;
        else
            return style.tab;
    }
    const handleEditSubmit = (e) => {
        e.preventDefault();
        getNewAccess();

        let token = Cookies.get("accessToken");

        if (!token) {
            getNewAccess();

            token = Cookies.get("accessToken");

            if (!token) {
                console.error("No access token available");
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Please try again later",
                    life: 5000
                });
                return;
            }
        }

        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('numero_client', numero);
        formData.append('biographie', bio);
        formData.append('first_name', firstname);
        formData.append('last_name', lastname);
        formData.append('adresse', adresse);
        formData.append('ville', city);

        if (file) {
            formData.append('profilPic', file);
        }


        fetch(`${UrlConfig.apiBaseUrl}/api/accounts/edit-client/`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })
            .then(async response => {
                console.log("Response received");
                if (!response.ok) {
                    const errorData = await response.json();
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: "Try again later",
                        life: 5000
                    });
                    console.error("Error data:", errorData);
                    throw new Error(`Error: ${errorData.message || "Unknown error"}`);

                }
                return response.json();
            })
            .then(data => {
                setUsername(data.username)
                setUsedProfil(profilePic);
                setUser(
                    {
                        username: data.username,
                        id: data.id,
                        userImage: profilePic,
                    }
                );
                setEdit((prev) => !prev);

                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Profil updated successfully",
                    life: 5000
                });
            })
            .catch(error => {
                console.error("Error updating user profile:", error);
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Please try again later",
                    life: 5000
                });
            });

    };
    return (
        <div className={style.container}>
            <div className={style.menu_container}>
                <Link style={{ textDecoration: "none" }} href={"/users/profil"}>
                    <span className={style.menu_active}><i className="pi pi-user" /> Profil</span>
                </Link>
                <Link style={{ textDecoration: "none" }} href={"/users/cart"}>
                    <span className={style.menu_item}><i className="pi pi-shopping-cart" /> Cart</span>
                </Link>
                <Link style={{ textDecoration: "none" }} href={"/users/cart"}>
                    <span className={style.menu_item}><i className="pi pi-clock" /> History</span>
                </Link>
                <Link style={{ textDecoration: "none" }} href={"/users/cart"}>
                    <span className={style.menu_item}><i className="pi pi-bell" /> Notification</span>
                </Link>
                <Link style={{ textDecoration: "none" }} href={"/users/cart"}>
                    <span className={style.menu_item}><i className="pi pi-shield" /> Security</span>
                </Link>
                <Link style={{ textDecoration: "none" }} href={"/users/setting"}>
                    <span className={style.menu_item}><i className="pi pi-cog" /> Setting</span>
                </Link>
                <Link style={{ textDecoration: "none" }} href={"/users/login"}>
                    <span className={style.menu_item}><i className="pi pi-sign-out" /> Log out</span>
                </Link>
            </div>

            <div className={style.profil_container}>
                <Link href={"/users"} className={style.back}><i className="pi pi-arrow-left" /> Back</Link>
                <div className={style.profil_image_container}>
                    <div className={style.profil_image_wrapper}>
                        <Avatar label={firstname[0]} shape="circle" alt="user" className={style.profil_image} image={userProfil ? userProfil : ""} />
                        <div className={style.profil_user_info}>
                            <span className={style.profil_username}>{username}</span>
                            <span className={style.profil_adresse}>
                                <span>Account ID :</span>
                                <span>#{accId}</span>
                            </span>
                        </div>
                    </div>
                    <Button className={style.edit_button} onClick={() => document.getElementById('fileInput').click()}
                        label="Upload" icon="pi pi-pen-to-square" >
                        <input
                            type="file"
                            id="fileInput"
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </Button>
                </div>
                <div className={style.separateur}></div>
                <div className={style.profil_detail_container}>
                    {edit ? (
                        <div className={style.profil_detail}>
                            <span className={style.title}>Personnal information</span>
                            <div className={style.profil}>
                                <div className={style.detail}>
                                    <span className={style.label}>First name</span>
                                    <input
                                        type="text"
                                        value={firstname || ''}
                                        onChange={(e) => setFirstname(e.target.value)}
                                        className={style.inputField}
                                    />
                                </div>
                                <div className={style.detail}>
                                    <span className={style.label}>Last name</span>
                                    <input
                                        type="text"
                                        value={lastname || ''}
                                        onChange={(e) => setLastname(e.target.value)}
                                        className={style.inputField}
                                    />
                                </div>
                                <div className={style.detail}>
                                    <span className={style.label}>Email</span>
                                    <input
                                        type="text"
                                        value={email || ''}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={style.inputField}
                                    />
                                </div>
                                <div className={style.detail}>
                                    <span className={style.label}>Contact</span>
                                    <input
                                        type="text"
                                        value={numero || ''}
                                        onChange={(e) => setNumero(e.target.value)}
                                        className={style.inputField}
                                    />
                                </div>
                                <div className={style.detail}>
                                    <span className={style.label}>Adresse</span>
                                    <input
                                        type="text"
                                        value={adresse || ''}
                                        onChange={(e) => setAdresse(e.target.value)}
                                        className={style.inputField}
                                    />
                                </div>
                                <div className={style.detail}>
                                    <span className={style.label}>City</span>
                                    <input
                                        type="text"
                                        value={city || ''}
                                        onChange={(e) => setCity(e.target.value)}
                                        className={style.inputField}
                                    />
                                </div>
                                <Button className={style.edit_button} onClick={
                                    handleEditSubmit
                                } label="Save" icon="pi pi-pen-to-square" />
                            </div>
                        </div>
                    ) : (<div className={style.profil_detail}>

                        <span className={style.title}>Personnal information</span>
                        <div className={style.profil}>
                            <div className={style.detail}>
                                <span className={style.label}>First name</span>
                                <span>{firstname} </span>
                            </div>
                            <div className={style.detail}>
                                <span className={style.label}>Last name</span>
                                <span>{lastname} </span>
                            </div>
                            <div className={style.detail}>
                                <span className={style.label}>Email</span>
                                <span>{email} </span>
                            </div>
                            <div className={style.detail}>
                                <span className={style.label}>Contact</span>
                                <span>{numero} </span>
                            </div>
                            <div className={style.detail}>
                                <span className={style.label}>Adresse</span>
                                <span>{adresse} </span>
                            </div>
                            <div className={style.detail}>
                                <span className={style.label}>City</span>
                                <span>{city} </span>
                            </div>
                        </div>
                    </div>
                    )}



                    <Button className={style.edit_button} onClick={() => {
                        setEdit((prev) => !prev);
                        console.log(edit);
                    }} label="Edit" icon="pi pi-pen-to-square" />
                </div>
            </div>
            <Toast ref={toast} />

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