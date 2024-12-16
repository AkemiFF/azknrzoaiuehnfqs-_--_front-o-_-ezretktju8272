import { useRouter } from "next/router"
import { useEffect } from "react"

export default function Etablissement(props) {

    const router = useRouter();

    useEffect(() => {
        router.push("/users/etablissement/addEmail");
    }, [router])

    return (
        <>

        </>
    )
}