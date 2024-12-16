import Head from "next/head";
import UserTopbar from "@/layouts/users/UserTopbar";
import style from '@/style/pages/users/Profile.module.css';
import Link from "next/link";
import { Avatar } from "primereact/avatar";
import { TabPanel, TabView } from "primereact/tabview";
import { Button } from "primereact/button";
import { useContext, useEffect, useRef, useState } from "react";
import { FetchUser } from "@/util/Cart";
import UrlConfig from "@/util/config";
import Cookies from "js-cookie";
import { getNewAccess } from "@/util/Cookies";
import { Toast } from "primereact/toast";
import LayoutContext from "@/layouts/context/layoutContext";


export default function Profile() {
    const [userInfo, setUserInfo] = useState(null);
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [username, setUsername] = useState("");
    const [adresse, setAdresse] = useState("");
    const [email, setEmail] = useState("");
    const [numero, setNumero] = useState("");
    const [bio, setBio] = useState("");
    const toast = useRef(null);
    const [profilePic, setProfilePic] = useState("");
    const [file, setFile] = useState(null);
    const [userProfil, setUsedProfil] = useState("");
    const { user, setUser } = useContext(LayoutContext);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };


    const panelClassName = (parent, index) => {
        if (parent.state.activeIndex === index)
            return style.tab_active;
        else
            return style.tab;
    }
    useEffect(() => {
        FetchUser()
            .then((data) => {
                setUserInfo(data);
                setFirstname(data.first_name);
                setLastname(data.last_name);
                setEmail(data.email);
                setUsername(data.username);
                setAdresse(data.adresse);
                setNumero(data.numero_client);
                setBio(data.biographie);
                setProfilePic(`${UrlConfig.apiBaseUrl}${data.profilPic}`);
                setUsedProfil(`${UrlConfig.apiBaseUrl}${data.profilPic}`);

            })
            .catch((error) => {
                console.error('Error fetching user info:', error);
            });
    }, []);

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
                    <span className={style.menu_active}>Profil</span>
                </Link>
                <Link style={{ textDecoration: "none" }} href={"/users/cart"}>
                    <span className={style.menu_item}>Shopping cart</span>
                </Link>
                <Link style={{ textDecoration: "none" }} href={"/responsable"}>
                    <span className={style.menu_item}>Responsable</span>
                </Link>
                <Link style={{ textDecoration: "none" }} href={"/users/setting"}>
                    <span className={style.menu_item}>Setting</span>
                </Link>
                <Link style={{ textDecoration: "none" }} href={"/users"}>
                    <span className={style.menu_item}>Return to home</span>
                </Link>
            </div>

            <div className={style.profil_container}>
                <div className={style.profil_image_container}>
                    <Avatar label="F" shape="circle" alt="user" className={style.profil_image} image={userProfil ? userProfil : ""} />
                    <div className={style.profil_user_info}>
                        <span className={style.profil_username}>{username}</span>
                        <span className={style.profil_adresse}>
                            <i className='pi pi-map-marker' />
                            {adresse}
                        </span>
                    </div>
                </div>
                <TabView
                    pt={{
                        root: { className: style.tab_container },
                        panelContainer: { className: style.tab_container },
                        navContainer: { className: style.tab_container }
                    }}
                >
                    <TabPanel
                        header="Information"
                        leftIcon="pi pi-user"
                        pt={{
                            headerAction: ({ parent }) => ({
                                className: panelClassName(parent, 0)
                            }),
                            header: { className: style.tab_container }
                        }}
                    >
                        <div className={style.info_user_container}>
                            <div className={style.info_user}>
                                <div className={style.info_user_title}>About</div>
                                <div className={style.info_user_paragraphe}>
                                    {bio}
                                </div>
                            </div>
                            <div className={style.info_user}>
                                <div className={style.info_user_title}>User information</div>
                                <div className={style.info_user_detail_container}>
                                    <div className={style.info_user_detail}>
                                        <span className={style.info_user_detail_label}>Firstname</span>
                                        <span className={style.info_user_detail_value}>{firstname}</span>
                                    </div>
                                    <div className={style.info_user_detail}>
                                        <span className={style.info_user_detail_label}>Lastname</span>
                                        <span className={style.info_user_detail_value}>{lastname}</span>
                                    </div>
                                    <div className={style.info_user_detail}>
                                        <span className={style.info_user_detail_label}>Address</span>
                                        <span className={style.info_user_detail_value}>{adresse}</span>
                                    </div>
                                    <div className={style.info_user_detail}>
                                        <span className={style.info_user_detail_label}>Email</span>
                                        <span className={style.info_user_detail_value}>{email}</span>
                                    </div>
                                    <div className={style.info_user_detail}>
                                        <span className={style.info_user_detail_label}>Contact</span>
                                        <span className={style.info_user_detail_value}>{numero}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel
                        header="Edit profil"
                        leftIcon="pi pi-pencil"
                        pt={{
                            headerAction: ({ parent }) => ({
                                className: panelClassName(parent, 1)
                            }),
                            header: { className: style.tab_container }
                        }}
                    >

                        <div className={style.edit_user_container}>
                            <div className={style.edit_image_container}>
                                <div className={style.edit_image}>
                                    <Avatar
                                        shape="circle"
                                        className={style.image_edit}
                                        image={profilePic}
                                        label="F"
                                    />
                                    <input
                                        type="file"
                                        id="fileInput"
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    <Button
                                        icon="pi pi-pencil"
                                        className={style.button_image}
                                        rounded
                                        aria-label="Edit photo"
                                        onClick={() => document.getElementById('fileInput').click()}
                                    />
                                    {/* {file && <Button
                                        className="button-primary"
                                        label="Upload"
                                    // onClick={handleUpload}
                                    />} */}
                                </div>
                            </div>
                            <div className={style.edit_user}>
                                <span className={style.edit_title}>About</span>
                                <div className={style.form_group_input}>
                                    <span className={style.form_label}>Bio</span>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        className={style.form_textarea}
                                    />
                                </div>
                            </div>
                            <div className={style.edit_user}>
                                <span className={style.edit_title}>User Information</span>
                                <div className={style.form_group_input}>
                                    <span className={style.form_label}>Firstname</span>
                                    <input
                                        type="text"
                                        value={firstname}
                                        onChange={(e) => setFirstname(e.target.value)}
                                        className={style.form_input}
                                    />
                                </div>
                                <div className={style.form_group_input}>
                                    <span className={style.form_label}>Lastname</span>
                                    <input
                                        type="text"
                                        value={lastname}
                                        onChange={(e) => setLastname(e.target.value)}
                                        className={style.form_input}
                                    />
                                </div>
                                <div className={style.form_group_input}>
                                    <span className={style.form_label}>Address</span>
                                    <input
                                        type="text"
                                        value={adresse}
                                        onChange={(e) => setAdresse(e.target.value)}
                                        className={style.form_input}
                                    />
                                </div>
                                <div className={style.form_group_input}>
                                    <span className={style.form_label}>Email</span>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={style.form_input}
                                    />
                                </div>
                                <div className={style.form_group_input}>
                                    <span className={style.form_label}>Contact</span>
                                    <input
                                        type="tel"
                                        value={numero}
                                        onChange={(e) => setNumero(e.target.value)}
                                        className={style.form_input}
                                    />
                                </div>
                            </div>
                            <Button onClick={handleEditSubmit} className="button-primary" label="Edit" icon="pi pi-pencil" />
                        </div>

                    </TabPanel>
                </TabView>
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
            <UserTopbar />
            {page}
        </>
    );
}