import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
export default function Setting() {

    const router = useRouter();


    useEffect(() => {
        if (typeof window != "undefined") {
            router.replace("/responsable/tour/setting/profil")
        }
    }, [router])

    return (
        <>
            <Head>
                <title>Setting</title>
            </Head>
        </>
    )
}