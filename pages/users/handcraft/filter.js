import Head from "next/head";
import { useTranslation } from "react-i18next";
import styleDropdown from './../../../style/components/ListCheckbox.module.css';
import style from './../../../style/pages/users/handcraft/filter.module.css';
import FilterHandcraft from "@/components/FilterHandCraft";
import ListCheckbox from "@/components/ListCheckbox";
import dynamic from "next/dynamic";
import ProductCard from "@/components/card/ProductCard";
import { DataView } from 'primereact/dataview';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { UrlConfig } from "@/util/config";
import { Slider } from "primereact/slider";

const FilterMap = dynamic(() => import('@/components/FilterMap'), { ssr: false });

export default function FilterHandCraftPage() {
    const { t } = useTranslation();
    const [handcrafts, setHandcrafts] = useState([]);
    const [allHandcrafts, setAllHandcrafts] = useState([]);
    const [priceIntervalle, setPriceIntervalle] = useState([1, 600]);
    const [selectedSpecifications, setSelectedSpecifications] = useState([]);
    const router = useRouter();
    const { location, store, type } = router.query;

    // Function pour Price
    const priceByPourcentage = (percentage) => {
        const minValue = 5;
        const maxValue = 600;

        percentage = Math.max(0, Math.min(100, percentage));
        return parseFloat((minValue + (percentage / 100) * (maxValue - minValue)).toFixed(2));
    };

    const applyFilters = (priceValues, specs) => {
        const priceMin = priceByPourcentage(priceValues[0] < priceValues[1] ? priceValues[0] : priceValues[1]);
        const priceMax = priceByPourcentage(priceValues[0] > priceValues[1] ? priceValues[0] : priceValues[1]);

        const filteredHandcrafts = allHandcrafts.filter(handcraft => {
            const matchesPrice = parseFloat(handcraft.prix_artisanat) >= priceMin && parseFloat(handcraft.prix_artisanat) <= priceMax;
            const matchesSpecs = specs.length === 0 || specs.every(spec => handcraft.specifications.includes(spec));
            return matchesPrice && matchesSpecs;
        });

        setHandcrafts(filteredHandcrafts);
    };

    const filterPrice = (e) => {
        const priceValues = e.value;
        setPriceIntervalle(priceValues);
        applyFilters(priceValues, selectedSpecifications);
    };

    // Function Filtre par specifications
    const handleSpecChange = (selectedSpecs) => {
        setSelectedSpecifications(selectedSpecs);
        applyFilters(priceIntervalle, selectedSpecs);
    };

    // Recuperer tous les liste des produits Artisanats
    useEffect(() => {
        fetch(`${UrlConfig.apiBaseUrl}/api/artisanat/produits-artisanaux/`)
            .then(res => res.json())
            .then(data => {
                setAllHandcrafts(data);
                setHandcrafts(data);
            })
            .catch(error => console.log(error));
    }, []);

    let itemTemplate = (handcraft) => {
        return <ProductCard
            key={handcraft.id}
            id={handcraft.id}
            nb_like={handcraft.total_likes}
            nom_produit={handcraft.nom_produit_artisanal}
            by={handcraft.artisanat.nom}
            location={`${handcraft.artisanat.localisation_artisanat.ville} ${handcraft.artisanat.localisation_artisanat.adresse}`}
            prix={`$ ${handcraft.prix_artisanat}`}
            discount={handcraft.discount}
            href={`/users/handcraft/${handcraft.id}`}
            images={handcraft.images}
        />
    }

    return (
        <>
            <Head>
                <title>Handcraft recherche</title>
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
                <div className={style.filter_header_container}>
                    <span className={style.filter_header_left}>
                        Handcraft  :
                        <span className={style.filter_header_left_bold}> {handcrafts.length} handcraft found</span>
                    </span>
                    <div></div>
                </div>
                <div className={style.filter_container}>
                    <div className={style.filter_left}>
                        <FilterMap
                            lat={-18.9433924}
                            lng={47.5288271}
                        />
                        <div className={styleDropdown.container}>
                            <span className={styleDropdown.title}>Price per night</span>
                            <div className={styleDropdown.listCheck}>
                                <div style={{ display: "flex", flexDirection: "column" }} className={styleDropdown.checkbox_container}>
                                    <Slider value={priceIntervalle} onChange={filterPrice} className="w-14rem" range />
                                    <div className={styleDropdown.price}>
                                        <span>${priceByPourcentage(priceIntervalle[0])}</span>
                                        <span>${priceByPourcentage(priceIntervalle[1])}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ListCheckbox onSpecChange={handleSpecChange} />
                    </div>
                    <div className={style.filter_right}>
                        <DataView
                            style={{ width: "100%" }}
                            itemTemplate={itemTemplate}
                            paginator
                            rows={9}
                            layout={"grid"}
                            value={handcrafts}
                            pt={{
                                grid: () => ({
                                    className: style.list_produit
                                })
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
