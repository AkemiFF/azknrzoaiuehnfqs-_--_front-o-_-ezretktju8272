import UserProfilMenu from "@/components/UserProfilMenu";
import AppTopbar from "@/layouts/AppTopbar";
import style from '@/style/pages/users/Profile.module.css';
import Head from "next/head";

export default function Profile() {
    return (
        <div className={style.container}>
            <UserProfilMenu active="Notification" />
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