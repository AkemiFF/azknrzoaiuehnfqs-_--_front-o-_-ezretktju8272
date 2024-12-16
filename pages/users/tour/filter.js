import Head from "next/head";
import style from './../../../style/pages/users/accommodation/filter.module.css';
import styleDropdown from './../../../style/components/ListCheckbox.module.css';
import dynamic from "next/dynamic";
import ListCheckbox from "@/components/ListCheckbox";
import HotelCard from "@/components/card/HotelCard";
import React, { useState, useEffect } from 'react';
import { getCsrfTokenDirect } from "@/util/csrf";
import Filter from "@/components/Filter";
import { UrlConfig } from "@/util/config";
import { useRouter } from "next/router";
import { DataView } from 'primereact/dataview';
import FilterTour from "@/components/FilterTour";
import TripCard from "@/components/card/TripCard";
import { Slider } from "primereact/slider";



const FilterMap = dynamic(() => import('@/components/FilterMap'), { ssr: false });

export default function Trip() {
    const [all_voyages, setAll_voyages] = useState([]);
    const [filteredVoyages, setFilteredVoyages] = useState([]);
    const [budgetFilters, setBudgetFilters] = useState([]);
    const [durationFilters, setDurationFilters] = useState([]);

    useEffect(() => {
        fetch(`${UrlConfig.apiBaseUrl}/api/tour/voyages/`)
            .then(res => res.json())
            .then(data => {
                setAll_voyages(data);
                setFilteredVoyages(data);
            })
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        const filterVoyages = () => {
            let filtered = all_voyages;

            if (budgetFilters.length > 0) {
                filtered = filtered.filter(voyage => {
                    const price = parseFloat(voyage.prix_voyage);
                    return budgetFilters.some(filter => {
                        switch (filter) {
                            case 'less_than_50': return price < 50;
                            case '50_to_100': return price >= 50 && price <= 100;
                            case '100_to_150': return price >= 100 && price <= 150;
                            case '150_to_200': return price >= 150 && price <= 200;
                            case '200_to_250': return price >= 200 && price <= 250;
                            case '250_to_300': return price >= 250 && price <= 300;
                            case 'more_than_300': return price > 300;
                            default: return true;
                        }
                    });
                });
            }

            if (durationFilters.length > 0) {
                filtered = filtered.filter(voyage => {
                    const days = (new Date(voyage.date_fin) - new Date(voyage.date_debut)) / (1000 * 60 * 60 * 24);
                    return durationFilters.some(filter => {
                        switch (filter) {
                            case 'less_than_3': return days < 3;
                            case 'less_than_7': return days < 7;
                            case 'more_than_7': return days > 7;
                            case 'more_than_14': return days > 14;
                            default: return true;
                        }
                    });
                });
            }

            setFilteredVoyages(filtered);
        };
        filterVoyages();
    }, [all_voyages, budgetFilters, durationFilters]);

    const handleBudgetChange = (budgetRange) => {
        setBudgetFilters(prevFilters => {
            if (prevFilters.includes(budgetRange)) {
                return prevFilters.filter(range => range !== budgetRange);
            } else {
                return [...prevFilters, budgetRange];
            }
        });
    };

    const handleDurationChange = (durationRange) => {
        setDurationFilters(prevFilters => {
            if (prevFilters.includes(durationRange)) {
                return prevFilters.filter(range => range !== durationRange);
            } else {
                return [...prevFilters, durationRange];
            }
        });
    };



    const itemTemplate = (voyage) => (
        <TripCard
            key={voyage.id}
            href={`/users/tour/${voyage.id}`}
            voyage={voyage}
        />
    );

    return (
        <>
            <Head>
                <title>Tour</title>
            </Head>

            <div className={style.container}>
                <div className={style.filter_header_top}>
                    <div className={style.filter_header_top_title_container}>
                        <span className={style.filter_header_top_title}>Find your best trip expedition in Madagascar with operator tour on Aftrip</span>
                        <span className={style.filter_header_top_subtitle}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat explicabo cupiditate</span>
                    </div>
                    <div className={style.filter_parent}>
                        <FilterTour />
                    </div>
                </div>
                <div className={style.filter_header_container}>
                    <span className={style.filter_header_left}>
                        Properties in Antananarivo :
                        <span className={style.filter_header_left_bold}> {filteredVoyages.length} properties found</span>
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
                            <span className={styleDropdown.title}>Budget</span>
                            <div className={styleDropdown.listCheck}>
                                <div className={styleDropdown.checkbox_container}>
                                    <input
                                        type='checkbox'
                                        id='less_than_50'
                                        onChange={() => handleBudgetChange('less_than_50')}
                                        className={styleDropdown.checkbox}
                                    />
                                    <label htmlFor='less_than_50' className={styleDropdown.checkbox_label}>
                                        Less than 50$
                                    </label>
                                </div>
                                <div className={styleDropdown.checkbox_container}>
                                    <input
                                        type='checkbox'
                                        id='50_to_100'
                                        onChange={() => handleBudgetChange('50_to_100')}
                                        className={styleDropdown.checkbox}
                                    />
                                    <label htmlFor='50_to_100' className={styleDropdown.checkbox_label}>
                                        50 to 100$
                                    </label>
                                </div>
                                <div className={styleDropdown.checkbox_container}>
                                    <input
                                        type='checkbox'
                                        id='100_to_150'
                                        onChange={() => handleBudgetChange('100_to_150')}
                                        className={styleDropdown.checkbox}
                                    />
                                    <label htmlFor='100_to_150' className={styleDropdown.checkbox_label}>
                                        100 to 150$
                                    </label>
                                </div>
                                <div className={styleDropdown.checkbox_container}>
                                    <input
                                        type='checkbox'
                                        id='150_to_200'
                                        onChange={() => handleBudgetChange('150_to_200')}
                                        className={styleDropdown.checkbox}
                                    />
                                    <label htmlFor='150_to_200' className={styleDropdown.checkbox_label}>
                                        150 to 200$
                                    </label>
                                </div>
                                <div className={styleDropdown.checkbox_container}>
                                    <input
                                        type='checkbox'
                                        id='200_to_250'
                                        onChange={() => handleBudgetChange('200_to_250')}
                                        className={styleDropdown.checkbox}
                                    />
                                    <label htmlFor='200_to_250' className={styleDropdown.checkbox_label}>
                                        200 to 250$
                                    </label>
                                </div>
                                <div className={styleDropdown.checkbox_container}>
                                    <input
                                        type='checkbox'
                                        id='250_to_300'
                                        onChange={() => handleBudgetChange('250_to_300')}
                                        className={styleDropdown.checkbox}
                                    />
                                    <label htmlFor='250_to_300' className={styleDropdown.checkbox_label}>
                                        250 to 300$
                                    </label>
                                </div>
                                <div className={styleDropdown.checkbox_container}>
                                    <input
                                        type='checkbox'
                                        id='more_than_300'
                                        onChange={() => handleBudgetChange('more_than_300')}
                                        className={styleDropdown.checkbox}
                                    />
                                    <label htmlFor='more_than_300' className={styleDropdown.checkbox_label}>
                                        More than 300$
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className={styleDropdown.container}>
                            <span className={styleDropdown.title}>Trip duration</span>
                            <div className={styleDropdown.listCheck}>
                                <div className={styleDropdown.checkbox_container}>
                                    <input
                                        type='checkbox'
                                        id='less_than_3'
                                        onChange={() => handleDurationChange('less_than_3')}
                                        className={styleDropdown.checkbox}
                                    />
                                    <label htmlFor='less_than_3' className={styleDropdown.checkbox_label}>
                                        Less than 3 days
                                    </label>
                                </div>
                                <div className={styleDropdown.checkbox_container}>
                                    <input
                                        type='checkbox'
                                        id='less_than_7'
                                        onChange={() => handleDurationChange('less_than_7')}
                                        className={styleDropdown.checkbox}
                                    />
                                    <label htmlFor='less_than_7' className={styleDropdown.checkbox_label}>
                                        Less than 7 days
                                    </label>
                                </div>
                                <div className={styleDropdown.checkbox_container}>
                                    <input
                                        type='checkbox'
                                        id='more_than_7'
                                        onChange={() => handleDurationChange('more_than_7')}
                                        className={styleDropdown.checkbox}
                                    />
                                    <label htmlFor='more_than_7' className={styleDropdown.checkbox_label}>
                                        More than 1 week
                                    </label>
                                </div>
                                <div className={styleDropdown.checkbox_container}>
                                    <input
                                        type='checkbox'
                                        id='more_than_14'
                                        onChange={() => handleDurationChange('more_than_14')}
                                        className={styleDropdown.checkbox}
                                    />
                                    <label htmlFor='more_than_14' className={styleDropdown.checkbox_label}>
                                        More than 2 weeks
                                    </label>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className={style.filter_right}>
                        <DataView
                            emptyMessage="No trips found"
                            itemTemplate={itemTemplate}
                            value={filteredVoyages}
                            paginator
                            rows={4}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}


