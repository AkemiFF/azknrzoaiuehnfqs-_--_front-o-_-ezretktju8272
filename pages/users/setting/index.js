import Head from "next/head";
import style from '@/style/pages/users/Profile.module.css';
import Link from "next/link";
import { Avatar } from "primereact/avatar";
import { TabPanel, TabView } from "primereact/tabview";
import { Button } from "primereact/button";
import AppTopbar from "@/layouts/AppTopbar";
export default function Profile() {



    const panelClassName = (parent, index) => {
        if (parent.state.activeIndex === index)
            return style.tab_active;
        else 
            return style.tab;
    }
    
    return(
        <div className={style.container}>
            <div className={style.menu_container}>
                <Link style={{textDecoration:"none"}} href={"/users/profil"}>
                    <span className={style.menu_item}><i className="pi pi-user"/> Profil</span>
                </Link>
                <Link style={{textDecoration:"none"}} href={"/users/cart"}>
                    <span className={style.menu_item}><i className="pi pi-shopping-cart"/> Cart</span>
                </Link>
                <Link style={{textDecoration:"none"}} href={"/users/cart"}>
                    <span className={style.menu_item}><i className="pi pi-clock"/> History</span>
                </Link>
                <Link style={{textDecoration:"none"}} href={"/users/cart"}>
                    <span className={style.menu_item}><i className="pi pi-bell"/> Notification</span>
                </Link>
                <Link style={{textDecoration:"none"}} href={"/users/cart"}>
                    <span className={style.menu_item}><i className="pi pi-shield"/> Security</span>
                </Link>
                <Link style={{textDecoration:"none"}}  href={"/users/setting"}>
                    <span className={style.menu_active}><i className="pi pi-cog"/> Setting</span>
                </Link>
                <Link style={{textDecoration:"none"}} href={"/users/login"}>
                    <span className={style.menu_item}><i className="pi pi-sign-out"/> Log out</span>
                </Link>
            </div>
 
        </div>
    );
}




Profile.getLayout = function getLayout(page) {
    return(
        <>
            <Head>
                <title>User profile</title>
            </Head>
            <AppTopbar/>
            {page}
        </>
    );
}