import CarouselContinu from "@/components/CarouselContinu";
import SwiperCarousel from "@/components/Swiper";
import Head from "next/head";



export default function Test() {

    return (
        <SwiperCarousel />
    )
}



Test.getLayout = function getLayout(page) {
    return (
        <>
            <Head>
                <title>Truc truc</title>

            </Head>

            {page}
        </>
    );
}