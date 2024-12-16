import { useRouter } from "next/router"
import { useEffect } from "react"

export default function Accommodation() {

    const router = useRouter();

    useEffect(() => {
        if (typeof window != "undefined") {
            router.push("accommodation/dashboard");
        }
    }, [router])

    return <></>
}