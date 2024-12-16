import Head from "next/head";
import style from './../../../../style/pages/responsable/accommodation/setting.module.css';
import { useState } from "react";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
export default function Help() {

    const router= useRouter();

    const [menuSidebar,setMenuSidebar] = useState([
        {label:"Profil"},
        {label:"Security"},
        {label:"Notification"},
        {label:"Log"},
        {label:"Help"}
    ]);

    const menu = 4;

    return(
        <>
            <Head>
                <title>Help</title>
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
            </div>
        </>
    )
}