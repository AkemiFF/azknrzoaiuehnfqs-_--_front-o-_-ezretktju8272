import Head from "next/head";
import style from './../../../../style/pages/responsable/accommodation/setting.module.css';
import style_profile from "./../../../../style/pages/responsable/accommodation/setting/profil.module.css";
import { useState } from "react";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";
export default function Profil() {

    const router= useRouter();

    const [menuSidebar,setMenuSidebar] = useState([
        {label:"Profil"},
        {label:"Security"},
        {label:"Notification"},
        {label:"Log"},
        {label:"Help"}
    ]);

    const menu = 0;

    return(
        <>
            <Head>
                <title>Profil</title>
            </Head>

            <div className={style.container}>
                <div className={style.left_container}>
                    <div className={style.left_top_container}>
                        <span className={style.left_top_subtitle}>{menuSidebar[menu].label}</span>
                        <span className={style.left_top_title}>Tik&apos;Art</span>
                    </div>
                    <div className={style.left_body_container}>
                        {menuSidebar.map((item,index)=>{
                            return <Button key={index} onClick={()=>router.push("/responsable/tour/setting/"+item.label.toLowerCase())} text className={menu==index ? "button-secondary" : style.text_button} raised={menu==index ? true : false} label={item.label}/>
                        })}
                    </div>
                </div>
                <div className={style.right_body_container}>
                    <div className={style_profile.container}>
                        <div className={style_profile.user_title_container}>
                            <div className={style_profile.user_title_left}>
                                <Avatar label="F" shape="circle" className={style_profile.user_avatar}/>
                                <div className={style_profile.user_title}>
                                    <span className={style_profile.title}>Faneva Mamitiana</span>
                                    <span>Manager</span>
                                </div>
                            </div>
                            <Button text className={style_profile.button_edit} icon="pi pi-pen-to-square" raised label="Edit"/>
                        </div>
                        <div className="separateur"></div>
                        <div className={style_profile.detail_user_container}>
                            <div className={style_profile.detail_user_top_container}>
                                <span className={style_profile.title}>Personnal information</span>
                                <Button text className={style_profile.button_edit} icon="pi pi-pen-to-square" raised label="Edit"/>
                            </div>
                            <div className={style_profile.detail_user_body_container}>
                                <div className={style_profile.detail_user}>
                                    <span className={style_profile.title}>First name</span>
                                    <span>Faneva</span>
                                </div>
                                <div className={style_profile.detail_user}>
                                    <span className={style_profile.title}>First name</span>
                                    <span>Faneva</span>
                                </div>
                                <div className={style_profile.detail_user}>
                                    <span className={style_profile.title}>First name</span>
                                    <span>Faneva</span>
                                </div>
                                <div className={style_profile.detail_user}>
                                    <span className={style_profile.title}>First name</span>
                                    <span>Faneva</span>
                                </div>
                                <div className={style_profile.detail_user}>
                                    <span className={style_profile.title}>First name</span>
                                    <span>Faneva</span>
                                </div>
                            </div>
                        </div>
                        <div className="separateur"></div>
                        <div className={style_profile.detail_user_container}>
                            <div className={style_profile.detail_user_top_container}>
                                <span className={style_profile.title}>Hotel information</span>
                                <Button text className={style_profile.button_edit} icon="pi pi-pen-to-square" raised label="Edit"/>
                            </div>
                            <div className={style_profile.detail_user_body_container}>
                                <div className={style_profile.detail_user}>
                                    <span className={style_profile.title}>First name</span>
                                    <span>Faneva</span>
                                </div>
                                <div className={style_profile.detail_user}>
                                    <span className={style_profile.title}>First name</span>
                                    <span>Faneva</span>
                                </div>
                                <div className={style_profile.detail_user}>
                                    <span className={style_profile.title}>First name</span>
                                    <span>Faneva</span>
                                </div>
                                <div className={style_profile.detail_user}>
                                    <span className={style_profile.title}>First name</span>
                                    <span>Faneva</span>
                                </div>
                                <div className={style_profile.detail_user}>
                                    <span className={style_profile.title}>First name</span>
                                    <span>Faneva</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}