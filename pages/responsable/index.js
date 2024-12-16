import Head from "next/head";
import UserTopbar from "@/layouts/users/UserTopbar";
import style from '@/style/pages/responsable/Responsable.module.css';
import { useContext, useEffect } from "react";
import ResponsableLayoutContext from "@/layouts/context/responsableLayoutContext";
import { useRouter } from "next/router";
export default function Responsable() {

    const router = useRouter();

    useEffect(()=>{
        let user =JSON.parse(localStorage.getItem("responsable_user"));
        if (user) {
            if (user.type_etablissement == 1) {
                router.push("/responsable/accommodation");
            } else if (user.type_etablissement == 2) {
                router.push("https://shoplg.online/users");
            } else if (user.type_etablissement == 3) {
                router.push("/responsable/tour");
            } else {
                router.push("/users/etablissement/login");
            }
        }
        else{
            router.push("/users/etablissement/login");
        }
    },[router])

    
    return(
        <div className={style.container}>
            
        </div>
    );
}




Responsable.getLayout = function getLayout(page) {
    return(
        <>
            <Head>
                <title>User Responsable</title>
            </Head>
            {page}
        </>
    );
}