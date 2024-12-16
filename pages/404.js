import Head from "next/head";
import style from "@/style/pages/404.module.css";
import AppTopbar from "@/layouts/AppTopbar";
import Link from "next/link";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import { Image } from "primereact/image";
export default function Error404() {
    const router = useRouter();
    return(
        <div className={style.container}>
            <div className={style.wrapper_404}>
                <div className={style.wrapper_title}>
                    <span className={style.title}>404 Error</span>
                    <span className={style.label}><span style={{color:"#305555"}}>Sorry !</span>this page isn’t available</span>
                </div>
                <span className={style.wrapper_label}>The page you were looking for couldn’t be found</span>
                <Button onClick={()=>router.back()} icon="pi pi-angle-left" label="Back" className="p-ripple button-primary" style={{backgroundColor:"#000"}}/>
            </div>
            <Image imageClassName={style.image_404} src={"/images/404/not_found.svg"} alt="not found" />
            <div className={style.footer}>
                <span className={style.footer_label}>Copyright 2024 - All rights reserved</span>
                <Link style={{color:"#000"}} href={"/users/privatePolicy"}>Pivate policy</Link>
            </div>
        </div>
    );
}



Error404.getLayout = function getLayout(page) {
    return(
        <>
            <Head>
                <title>Page not found</title>
            </Head>
            <AppTopbar/>
            {page}
        </>
    );
}