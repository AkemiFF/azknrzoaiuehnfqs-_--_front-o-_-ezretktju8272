import Head from "next/head";
import style from './../../../style/pages/users/accommodation/filter.module.css';
import styleDropdown from './../../../style/components/ListCheckbox.module.css';
import HotelCard from "@/components/card/HotelCard";
import React, { useState, useEffect, useRef } from 'react';
import { getCsrfTokenDirect } from "@/util/csrf";
import Filter from "@/components/Filter";
import { UrlConfig } from "@/util/config";
import { useRouter } from "next/router";
import { DataView } from 'primereact/dataview';
import FilterMap from "@/components/FilterMap";
import { Slider } from "primereact/slider";
import { MultiSelect } from 'primereact/multiselect';
import { Chip } from "primereact/chip";


export default function Accommodation() {

    const [positionActuel, setPositionActuel] = useState({
        latitude: -18,
        longitude: 47
    });

    const toast = useRef(null);

    const [distanceChoice, setDistanceChoice] = useState(0);

    const [allAmmenities, setAllAmmenities] = useState([]);
    const [ammenitieSelected, setAmmenitieSelected] = useState([]);

    const [priceIntervalle, setPriceIntervalle] = useState([0, 100]);

    const [rate, setRate] = useState(0);

    const [hotels, setHotels] = useState([]);
    const [allHotels, setAllHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [positions, setPositions] = useState([]);

    const router = useRouter();
    const { type, location, check_in, check_out, invite } = router.query;


    const itemTemplate = (hotel) => {
        const baseUrl = `${UrlConfig.apiBaseUrl}`;
        // console.log(hotel);
        const imageUrl = hotel.images && hotel.images.length > 0 ? `${baseUrl}${hotel.images[0].image}` : "";
        return (

            <HotelCard
                href={`/users/accommodation/${hotel.id}`}
                id={hotel.id}
                nb_like={hotel.total_likes}
                rate={hotel.nombre_etoile_hebergement}
                img={imageUrl}
                price={hotel.min_prix_nuit_chambre}
                name={hotel.nom_hebergement}
                localisation={hotel.localisation && hotel.localisation.adresse + " " + hotel.localisation.ville}
                description={hotel.description_hebergement}
            />
        );
    };


    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setPositionActuel(position.coords);
                },
                (error) => {
                    console.log(error);
                }
            );
        }
        const getInfoFilter = () => {

            const { type, location, check_in, check_out, guest } = router.query;


            // Formater les dates
            if (check_in && check_out) {
                const formattedCheckIn = new Date(check_in.split('/').reverse().join('-')).toLocaleDateString('fr-FR');
                const formattedCheckOut = new Date(check_out.split('/').reverse().join('-')).toLocaleDateString('fr-FR');

                // Créer l'objet JSON
                const formattedInfo = {
                    type: type,
                    location: location,
                    checkIn: formattedCheckIn,
                    checkOut: formattedCheckOut,
                    guests: guest
                };
                console.log(formattedInfo);
                return formattedInfo;
            } else if (type && location && guest) {
                const formattedInfo = {
                    type: type,
                    location: location,
                    guests: guest
                };
                console.log(formattedInfo);

                return formattedInfo;
            } else {
                return false;

            }

        }


        const fetchHotels = async () => {
            try {
                const csrfToken = await getCsrfTokenDirect();
                const response = await fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/get-all-hebergement/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'X-CSRFToken': csrfToken,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch hotels');
                }

                const data = await response.json();
                setHotels(data.hebergements);
                setAllHotels(data.hebergements);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching hotel data:', error);
                setError(error);
                setLoading(false);
            }
        };

        const fetchFilteredData = async () => {
            try {
                const formattedInfo = getInfoFilter();

                const response = await fetch(`${UrlConfig.apiBaseUrl}/api/your-endpoint/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formattedInfo)
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch filtered data');
                }

                const data = await response.json();
                setHotels(data.hebergements);
                setAllHotels(data.hebergements);
                setLoading(false);
                return data;
            } catch (error) {
                console.error('Error fetching filtered data:', error);
            }
        };

        const fetchAmmenities = async () => {
            try {
                const csrfToken = await getCsrfTokenDirect();
                const response = await fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/get-all-amenities/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'X-CSRFToken': csrfToken,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch hotels');
                }

                const data = await response.json();
                setAllAmmenities(data.hebergements);
                // console.log(data.hebergements);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching ammenties data:', error);
                setError(error);
                setLoading(false);
            }
        };
        fetchAmmenities();
        fetchHotels();
        getInfoFilter();
    }, [router.query]);


    useEffect(() => {
        const positionCopy = [];
        hotels.length != 0 & hotels.map((d) => {
            d.localisation != null && positionCopy.push({
                adresse: d.nom_hebergement,
                latitude: d.localisation.latitude,
                longitude: d.localisation.longitude
            });
        });
        setPositions(positionCopy);
    }, [hotels])

    function calculateDistance(lat2, lon2) {
        const R = 6371; // Rayon de la Terre en kilomètres
        const toRad = (angle) => angle * (Math.PI / 180);

        const dLat = toRad(lat2 - positionActuel.latitude);
        const dLon = toRad(lon2 - positionActuel.longitude);
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(positionActuel.latitude)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance en kilomètres
    }

    // useEffect(()=>{
    //     fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/get-all-hebergement/`)
    //     .then(res=>res.json())
    //     .then(data=>setHotels(data))
    //     .catch(error=>console.log(error));
    // },[])


    const checkDistance = (choix) => {
        if (choix == distanceChoice) {
            setDistanceChoice(0);
            setHotels(allHotels);
        }
        else {
            setDistanceChoice(choix);
            getHotelByDistance(choix);
        }
    }

    const checkRate = (choix) => {
        if (choix == rate) {
            setRate(0);
            setHotels(allHotels);
        }
        else {
            const hotelCopy = [];
            setRate(choix);
            allHotels.map((hotel) => {
                if (hotel.nombre_etoile_hebergement) {
                    if (choix == hotel.nombre_etoile_hebergement) {
                        hotelCopy.push(hotel);
                    }
                }
            });
            setHotels(hotelCopy);
        }
    }


    const getHotelByDistance = (choix) => {
        const hotelCopy = [];
        if (choix == 1) {
            allHotels.map((hotel) => {
                if (hotel.localisation) {
                    let distance = calculateDistance(hotel.localisation.latitude, hotel.localisation.longitude);
                    console.log("distance", distance);
                    if (distance < 1) {
                        hotelCopy.push(hotel);
                    }
                }
            });
        }
        if (choix == 2) {
            allHotels.map((hotel) => {
                if (hotel.localisation) {
                    let distance = calculateDistance(hotel.localisation.latitude, hotel.localisation.longitude);
                    console.log("distance", distance);
                    if (distance < 5 && distance >= 1) {
                        hotelCopy.push(hotel);
                    }
                }
            });
        }
        if (choix == 3) {
            allHotels.map((hotel) => {
                if (hotel.localisation) {
                    let distance = calculateDistance(hotel.localisation.latitude, hotel.localisation.longitude);
                    console.log("distance", distance);
                    if (distance > 5 && distance <= 10) {
                        hotelCopy.push(hotel);
                    }
                }
            });
        }
        if (choix == 4) {
            allHotels.map((hotel) => {
                if (hotel.localisation) {
                    let distance = calculateDistance(hotel.localisation.latitude, hotel.localisation.longitude);
                    console.log("distance", distance);
                    if (distance > 10) {
                        hotelCopy.push(hotel);
                    }
                }
            });
        }
        setHotels(hotelCopy);
    }

    const priceByPourcentage = (percentage) => {
        // Les valeurs de base
        const minValue = 5;
        const maxValue = 600;

        if (percentage < 0 || percentage > 100) {
            throw new Error("Le pourcentage doit être entre 0 et 100.");
        }

        // Calculer la valeur en utilisant l'interpolation linéaire
        const value = minValue + (percentage / 100) * (maxValue - minValue);

        // Arrondir à 2 chiffres après la virgule
        return value.toFixed(2);
    }


    const filterPrice = (e) => {
        setPriceIntervalle(e.value);
        let priceMin = priceByPourcentage(e.value[0] < e.value[1] ? e.value[0] : e.value[1]);
        let priceMax = priceByPourcentage(e.value[0] > e.value[1] ? e.value[0] : e.value[1]);

        let hotelCopy = [];
        allHotels.map((hotel) => {
            if (hotel.min_prix_nuit_chambre >= priceMin && hotel.min_prix_nuit_chambre <= priceMax) {
                hotelCopy.push(hotel);
            }
        });
        setHotels(hotelCopy);
    }

    const filterAmmenties = (e) => {
        setAmmenitieSelected(e.value);
        if (e.value.length != 0) {
            let hotelCopy = [];
            allHotels.map(hotel => {
                if (hotel.accessoires.lenght != 0) {
                    let find = false;
                    for (let i = 0; i < hotel.accessoires.length; i++) {
                        const accessoire = hotel.accessoires[i];
                        for (let j = 0; j < e.value.length; j++) {
                            const ammenities = e.value[j];
                            if (ammenities.id == accessoire) {
                                hotelCopy.push(hotel);
                                find = true;
                                break;
                            }
                        }
                        if (find) {
                            break;
                        }
                    }
                }
            })
            setHotels(hotelCopy);
        }
        else {

            setHotels(allHotels);
        }
    }



    return (
        <>
            <Head>
                <title>Accommodation</title>
            </Head>

            <div className={style.container}>
                <div className={style.filter_header_top}>
                    <div className={style.filter_header_top_title_container}>
                        <span className={style.filter_header_top_title}>Find your best accommodation on Hotello</span>
                        <span className={style.filter_header_top_subtitle}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat explicabo cupiditate </span>
                    </div>
                    <div className={style.filter_parent}>
                        <Filter
                            locationSelected={location && location}
                            typeSelected={type && type}
                        />
                    </div>
                </div>
                <div className={style.filter_header_container}>
                    <span className={style.filter_header_left}>
                        Properties  :
                        <span className={style.filter_header_left_bold}> {hotels.length} properties found</span>
                    </span>
                    <div></div>
                </div>
                <div className={style.filter_container}>
                    <div className={style.filter_left}>
                        <FilterMap
                            positions={positions}
                        />
                        <div className={styleDropdown.container}>
                            <span className={styleDropdown.title}>Price per night</span>
                            <div className={styleDropdown.listCheck}>
                                <div style={{ display: "flex", flexDirection: "column" }} className={styleDropdown.checkbox_container}>
                                    <Slider style={{ width: "100%" }} value={priceIntervalle} onChange={filterPrice} range />
                                    <div className={styleDropdown.price}>
                                        <span>${priceByPourcentage(priceIntervalle[0])}</span>
                                        <span>${priceByPourcentage(priceIntervalle[1])}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styleDropdown.container}>
                            <span className={styleDropdown.title}>Ammenities</span>
                            <div className={styleDropdown.listCheck}>
                                <div style={{ display: "flex", flexDirection: "column" }} className={styleDropdown.checkbox_container}>
                                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                                        {
                                            ammenitieSelected.map((ammenties, key) => {
                                                return <Chip
                                                    key={key}
                                                    label={ammenties.nom_accessoire}
                                                />
                                            })
                                        }
                                    </div>
                                    <MultiSelect
                                        value={ammenitieSelected}
                                        onChange={filterAmmenties}
                                        options={allAmmenities}
                                        optionLabel="nom_accessoire"
                                        placeholder="Select the ammenities"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styleDropdown.container}>
                            <span className={styleDropdown.title}>Distance from your position</span>
                            <div className={styleDropdown.listCheck}>
                                <div className={styleDropdown.checkbox_container}>
                                    <input onChange={() => checkDistance(1)} checked={distanceChoice == 1} type='checkbox' className={styleDropdown.checkbox} />
                                    <span className={styleDropdown.checkbox_label}>Less than 1 km</span>
                                </div>
                                <div className={styleDropdown.checkbox_container}>
                                    <input onChange={() => checkDistance(2)} checked={distanceChoice == 2} type='checkbox' className={styleDropdown.checkbox} />
                                    <span className={styleDropdown.checkbox_label}>1 to 5km</span>
                                </div>
                                <div className={styleDropdown.checkbox_container}>
                                    <input onChange={() => checkDistance(3)} checked={distanceChoice == 3} type='checkbox' className={styleDropdown.checkbox} />
                                    <span className={styleDropdown.checkbox_label}>5 to 10km</span>
                                </div>
                                <div className={styleDropdown.checkbox_container}>
                                    <input onChange={() => checkDistance(4)} checked={distanceChoice == 4} type='checkbox' className={styleDropdown.checkbox} />
                                    <span className={styleDropdown.checkbox_label}>More than 10km</span>
                                </div>
                            </div>
                        </div>
                        <div className={styleDropdown.container}>
                            <span className={styleDropdown.title}>Property rate</span>
                            <div className={styleDropdown.listCheck}>
                                <div className={styleDropdown.checkbox_container}>
                                    <input onChange={() => checkRate(1)} checked={rate == 1} type='checkbox' className={styleDropdown.checkbox} />
                                    <span className={styleDropdown.checkbox_label}>1 star</span>
                                </div>
                                <div className={styleDropdown.checkbox_container}>
                                    <input onChange={() => checkRate(2)} checked={rate == 2} type='checkbox' className={styleDropdown.checkbox} />
                                    <span className={styleDropdown.checkbox_label}>2 star</span>
                                </div>
                                <div className={styleDropdown.checkbox_container}>
                                    <input onChange={() => checkRate(3)} checked={rate == 3} type='checkbox' className={styleDropdown.checkbox} />
                                    <span className={styleDropdown.checkbox_label}>3 star</span>
                                </div>
                                <div className={styleDropdown.checkbox_container}>
                                    <input onChange={() => checkRate(4)} checked={rate == 4} type='checkbox' className={styleDropdown.checkbox} />
                                    <span className={styleDropdown.checkbox_label}>4 star</span>
                                </div>
                                <div className={styleDropdown.checkbox_container}>
                                    <input onChange={() => checkRate(5)} checked={rate == 5} type='checkbox' className={styleDropdown.checkbox} />
                                    <span className={styleDropdown.checkbox_label}>5 star</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={style.filter_right}>
                        <DataView
                            emptyMessage="No hotel found"
                            itemTemplate={itemTemplate}
                            value={hotels}
                            paginator
                            rows={4}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
