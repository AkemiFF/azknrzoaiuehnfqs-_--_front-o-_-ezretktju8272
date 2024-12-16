import Head from 'next/head';
import { useTranslation } from "react-i18next";
import style from './../../../style/pages/users/handcraft/id.module.css';
import DetailProduct from '@/components/card/DetailProduct';
import ProductCard from '@/components/card/ProductCard';
import FilterHandcraft from '@/components/FilterHandCraft';
import { useState } from 'react';
import { useEffect } from 'react';
import { UrlConfig } from '@/util/config';
export default function DetailHandcraft() {

    const { t } = useTranslation();
    const [handcrafts, setHandcrafts] = useState([]);


    // Recuperer tous les liste des produits artisanaux
    useEffect(() => {
        fetch(`${UrlConfig.apiBaseUrl}/api/artisanat/produits-artisanaux/`)
            .then(res => res.json())
            .then(data => setHandcrafts(data))
            .catch(error => console.log(error));
    }, [])

    if (!handcrafts) {
        return <div>Loading...</div>
    }
    return (
        <>
            <Head>
                <title>Product Detail</title>
            </Head>
            <div className={style.container}>
                <div className={style.filter_header_top}>
                    <div className={style.filter_header_top_title_container}>
                        <span className={style.filter_header_top_title}>{t("handcraft_header_title")}</span>
                        <span className={style.filter_header_top_subtitle}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat explicabo cupiditate </span>
                    </div>
                    <div className={style.filter_parent}>
                        <FilterHandcraft />
                    </div>
                </div>
                <DetailProduct />
                <div className={style.suggestion_container}>
                    <span className={style.suggestion_title}>You will definitely like to see</span>
                    <div className={style.suggestion_body}>
                        {handcrafts.length > 0 ? (
                            handcrafts.map((product, index) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    nb_like={product.total_likes}
                                    nom_produit={product.nom_produit_artisanal}
                                    by={product.artisanat.nom}
                                    location={`${product.artisanat.localisation_artisanat ? product.artisanat.localisation_artisanat.ville : ""} ${product.artisanat.localisation_artisanat ? product.artisanat.localisation_artisanat.adresse : ""}`}
                                    prix={`$ ${product.prix_artisanat}`}
                                    discount={product.discount}
                                    href={`/users/handcraft/${product.id}`}
                                    images={product.images}
                                />
                            ))
                        ) : (
                            <p>{t("no_suggested_products")}</p>
                        )}
                    </div>
                </div>

            </div>

        </>
    )
}