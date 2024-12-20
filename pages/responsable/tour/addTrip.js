import Head from "next/head";
import style from '@/style/pages/responsable/tour/addTrip.module.css';
import { useRef, useState, useEffect, useContext } from "react";
import { Image } from "primereact/image";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { classNames } from "primereact/utils";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { MultiSelect } from "primereact/multiselect";
import { useRouter } from "next/router";
import { Toast } from "primereact/toast"; // Import Toast
import { UrlConfig } from "@/util/config";
import { getResponsableAccessToken } from "@/util/Cookies";
import ResponsableLayoutContext from "@/layouts/context/responsableLayoutContext";
import { handleAddImage, handleAddTrip } from "@/util/AdminTrip";

export default function AddTrip() {
    const { user } = useContext(ResponsableLayoutContext);
    const [name, setName] = useState("");
    const [depart, setDepart] = useState("");
    const [pricePerPerson, setPricePerPerson] = useState("");
    const [dateRange, setDateRange] = useState(null); // Pour la plage de dates
    const [destination, setDestination] = useState("");
    const [totalPlace, setTotalPlace] = useState("");
    const [distance, setDistance] = useState("");
    const [availablePlace, setAvailablePlace] = useState("");
    const [description, setDescription] = useState("");
    const router = useRouter();
    const toast = useRef(null);
    const [imageFile, setImageFile] = useState();
    const inputRef = useRef(null);
    const [inclusionOptions, setInclusionOptions] = useState([]); // État pour stocker les inclusions
    const [selectedInclusion, setSelectedInclusion] = useState(null);
    const [transportOptions, setTransportOptions] = useState([]);
    const [selectedTransport, setSelectedTransport] = useState([]);
    const [IdEtablissement, setIdEtablissement] = useState(null);
    const [missingFields, setMissingFields] = useState({});

    // États pour stocker date début et date fin séparément
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');

    useEffect(() => {
        if (user) {
            setIdEtablissement(user.id_etablissement);
        }
    }, [user]);


    // Mise à jour automatique des dates début et fin lorsque dateRange change
    useEffect(() => {
        if (dateRange && dateRange.length === 2) {
            setDateDebut(formatDate(dateRange[0])); // Mettre à jour date début
            setDateFin(formatDate(dateRange[1]));   // Mettre à jour date fin
        }
    }, [dateRange]);

    // Fonction pour formater la date au format YYYY-MM-DD
    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        // Récupération de la liste des inclusions via l'API
        const fetchInclusions = async () => {
            try {
                const response = await fetch(`${UrlConfig.apiBaseUrl}/api/tour/inclusions/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des inclusions.");
                }

                const data = await response.json();



                if (Array.isArray(data)) {
                    // Transformer les données pour les adapter au format attendu par Dropdown
                    const formattedOptions = data.map((inclusion) => ({
                        name: inclusion.nom_inclusion, // Champ "name" de l'API
                        code: inclusion.id,   // Champ "id" de l'API
                    }));

                    setInclusionOptions(formattedOptions);
                } else {
                    throw new Error("Les données reçues ne sont pas valides.");
                }
            } catch (error) {
                console.error("Erreur:", error.message);
                toast.current?.show({ severity: "error", summary: "Erreur", detail: error.message });
            }
        };

        fetchInclusions();
    }, []);


    useEffect(() => {
        // Récupération de la liste des inclusions via l'API
        const fetchTransport = async () => {
            try {
                const response = await fetch(`${UrlConfig.apiBaseUrl}/api/tour/type-transports/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des transports.");
                }

                const data = await response.json();



                if (Array.isArray(data)) {
                    // Transformer les données pour les adapter au format attendu par Dropdown
                    const formattedOptions = data.map((transports) => ({
                        name: transports.nom_type, // Champ "name" de l'API
                        code: transports.id,
                        place: transports.place   // Champ "id" de l'API
                    }));

                    setTransportOptions(formattedOptions);
                } else {
                    throw new Error("Les données reçues ne sont pas valides.");
                }
            } catch (error) {
                console.error("Erreur:", error.message);
                toast.current?.show({ severity: "error", summary: "Erreur", detail: error.message });
            }
        };

        fetchTransport();
    }, []);

    const [travelDetails, setTravelDetails] = useState([
        { nom_ville: "", date_trajet: "", description_trajet: "" },
    ]);

    // Fonction pour gérer les changements dans les champs
    const handleChange = (index, field, value) => {
        const updatedDetails = [...travelDetails];
        updatedDetails[index][field] = value;
        setTravelDetails(updatedDetails);
    };

    // Fonction pour ajouter un nouvel ensemble de champs
    const handleAddField = () => {
        setTravelDetails([...travelDetails, { nom_ville: "", date_trajet: "", description_trajet: "" }]);
    };

    const [visibleInclude, setVisibleInclude] = useState(false);
    const [visibleNotInclude, setVisibleNotInclude] = useState(false);

    const [listImage, setListImage] = useState([]);

    const handleClick = () => {
        inputRef.current.click();
    }

    const handleFileUpload = () => {
        const files = inputRef.current.files; // Récupère les fichiers depuis l'input
        console.log(files);

        if (files.length > 0) {
            const validFiles = Array.from(files).filter((file) => file.type.startsWith('image/')); // Filtre uniquement les images
            if (validFiles.length > 0) {
                setListImage((prevList) => [...prevList, ...validFiles]); // Ajoute les fichiers à la liste existante
            } else {
                console.warn("Aucun fichier valide trouvé (uniquement les images sont autorisées).");
            }
        }
    };




    const addButtonIncluded = () => {
        return <Button className={"button-primary"} label="Add included" />
    }

    const addButtonNotIncluded = () => {
        return <Button className={"button-primary"} label="Add not included" />
    }

    const handleSubmit = async (e) => {
        e.preventDefault();


        // Collecting missing fields
        const newMissingFields = {
            nom_voyage: !name || name.trim() === "",
            ville_depart: !depart || depart.trim() === "",
            destination_voyage: !destination || destination.trim() === "",
            date_debut: !dateRange || !dateRange[0], // Vérifie si la première date est absente
            date_fin: !dateRange || !dateRange[1], // Vérifie si la deuxième date est absente
            distance: !distance || isNaN(distance),
            prix_voyage: !pricePerPerson || isNaN(pricePerPerson),
            places_disponibles: !availablePlace || isNaN(availablePlace),
            description_voyage: !description || description.trim() === "",
            type_transport: !selectedTransport || !selectedTransport.code,
            inclusions: !selectedInclusion || selectedInclusion.length === 0,
            tour_operateur: !IdEtablissement,
            nom_ville: travelDetails.some(detail => !detail.nom_ville.trim()), // Vérifie si l'un des noms de ville est vide
            date_trajet: travelDetails.some(detail => !detail.date_trajet), // Vérifie si l'une des dates de trajet est vide
            description_trajet: travelDetails.some(detail => !detail.description_trajet.trim()) // Vérifie si l'une des descriptions de trajet est vide
        };

        // Mise à jour de l'état
        setMissingFields(newMissingFields);



        // Check if any fields are missing
        if (Object.values(newMissingFields).some((isMissing) => isMissing)) {
            if (toast.current) {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'All fields are required',
                    life: 3000,
                });
            }
            return;
        }

        const formattedInclusionOptions = selectedInclusion.map((inclusion) => (inclusion.code));

        const tripData = {
            nom_voyage: name,
            ville_depart: depart,
            destination_voyage: destination,
            date_debut: dateRange && dateRange[0] ? formatDate(dateRange[0]) : '',
            date_fin: dateRange && dateRange[1] ? formatDate(dateRange[1]) : '',
            distance: distance,
            prix_voyage: pricePerPerson,
            places_disponibles: availablePlace,
            description_voyage: description,
            type_transport: selectedTransport.code,
            inclusions: formattedInclusionOptions,
            tour_operateur: IdEtablissement,
        };

        const formData = new FormData();

        listImage.forEach((image) => {
            formData.append('images', image);
        });

        const data = await handleAddTrip(tripData);

        if (data) {
            await handleAddImage(formData, data.id, toast);
            await addTrajets(data.id, travelDetails);
            eraseData();
        }

    };


    const eraseData = () => {
        setTimeout(() => {
            setName([]);
            setDepart("");
            setPricePerPerson("");
            setDateRange("");
            setDestination("");
            setTotalPlace("");
            setDistance("");
            setDescription("");
            setSelectedInclusion([]);
            setAvailablePlace("");
            setSelectedTransport("");
            setListImage([]);
            setTravelDetails([]);
            // Recharger la page
            //window.location.reload();
        }, 500);
    }

    const addTrajets = async (idVoyage, travelDetails) => {
        try {
            // Parcourir tous les trajets et les envoyer un par un
            for (const detail of travelDetails) {
                const response = await fetch(
                    `${UrlConfig.apiBaseUrl}/api/tour/voyages/${idVoyage}/create-trajet/`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            //Authorization: `Bearer ${yourAccessToken}`, // Remplacez par votre token
                        },
                        body: JSON.stringify({
                            nom_ville: detail.nom_ville,
                            date_trajet: detail.date_trajet,
                            description_trajet: detail.description_trajet,
                        }),
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Erreur lors de l'ajout d'un trajet :", errorData);
                }
            }
        } catch (error) {
            console.error("Une erreur s'est produite :", error);
        }
    };


    return (
        <>
            <Head>
                <title>Add new Trip</title>
            </Head>
            <Toast ref={toast} />

            <div className={style.top_container}>
                <div className={style.top_container_title_container}>
                    <span className={style.top_container_title}>Trip</span>
                    <span className={style.top_container_subtitle}>Tour de voyage</span>
                </div>
            </div>

            <div className={style.container}>
                <div className={style.image_container}>
                    <div onClick={handleClick} className={style.button_image}>
                        <i className="pi pi-plus" />
                        <span>Add image</span>
                        <input value={imageFile} ref={inputRef} onChange={handleFileUpload} type="file" accept="image/*" style={{ display: "none" }} />
                    </div>
                    {listImage.map((image, index) => {
                        // Si `image` est un objet `File`, crée une URL blob pour l'afficher
                        const imageUrl = typeof image === 'object' && image instanceof File ? URL.createObjectURL(image) : image;

                        return (
                            <div key={index} className={style.image_add_container}>
                                <Image className={style.image} src={imageUrl} alt={`Image ${index + 1}`} />
                            </div>
                        );
                    })}

                </div>
                <div className={style.room_detail_container}>
                    <span className={style.room_detail_title}>Trip information</span>
                    <div className={style.room_detail}>
                        <div className={style.left_detail}>
                            <FloatLabel>
                                <InputText
                                    className={style.input_text}
                                    id="name_input"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <label htmlFor="name_input">Name</label>
                            </FloatLabel>
                            <FloatLabel>
                                <InputText
                                    className={style.input_text}
                                    id="depart_input"
                                    type="text"
                                    value={depart}
                                    onChange={(e) => setDepart(e.target.value)}
                                />
                                <label htmlFor="depart_input">Départ</label>
                            </FloatLabel>
                            <FloatLabel>
                                <InputText
                                    className={style.input_text}
                                    id="price_person_input"
                                    type="text"
                                    value={pricePerPerson}
                                    onChange={(e) => setPricePerPerson(e.target.value)}
                                />
                                <label htmlFor="price_person_input">Price per Person</label>
                            </FloatLabel>
                        </div>
                        <div className={style.right_detail}>
                            <FloatLabel>
                                <Calendar
                                    selectionMode="range"
                                    className={style.input_text}
                                    id="date_input"
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.value)}
                                    placeholder="Select date range"
                                />
                                <label htmlFor="date_input">Date début à fin</label>
                            </FloatLabel>
                            <FloatLabel>
                                <InputText
                                    className={style.input_text}
                                    id="arrive_input"
                                    type="text"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                />
                                <label htmlFor="arrive_input">Déstination</label>
                            </FloatLabel>
                            <FloatLabel>
                                <InputText
                                    className={style.input_text}
                                    id="place_input"
                                    type="text"
                                    value={totalPlace}
                                    onChange={(e) => setTotalPlace(e.target.value)}
                                />
                                <label htmlFor="place_input">Total place</label>
                            </FloatLabel>
                        </div>
                        <div className={style.right_detail}>
                            <FloatLabel>
                                <InputText
                                    className={style.input_text}
                                    id="distance_input"
                                    type="text"
                                    value={distance}
                                    onChange={(e) => setDistance(e.target.value)}
                                />
                                <label htmlFor="distance_input">Distance</label>
                            </FloatLabel>
                            <FloatLabel>
                                <InputText
                                    className={style.input_text}
                                    id="available_place_input"
                                    type="text"
                                    value={availablePlace}
                                    onChange={(e) => setAvailablePlace(e.target.value)}
                                />
                                <label htmlFor="available_place_input">Available place</label>
                            </FloatLabel>
                        </div>
                    </div>
                </div>
                <div className="separateur"></div>
                <div className={style.room_detail_container}>
                    <span className={style.room_detail_title}>Travel inclusion</span>
                    <div className={style.travel_inclusion_container}>
                        <MultiSelect
                            value={selectedInclusion}
                            options={inclusionOptions}
                            onChange={(e) => setSelectedInclusion(e.value)}
                            optionLabel="name"
                            placeholder="Sélectionner une inclusion"
                            className="w-full md:w-20rem"
                        />
                    </div>

                    <div className={style.travel_inclusion_container}>
                        <Dropdown
                            value={selectedTransport}
                            options={transportOptions}
                            onChange={(e) => setSelectedTransport(e.value)}
                            optionLabel="name"
                            placeholder="Sélectionner le transport"
                            className="w-full md:w-20rem"
                        />
                    </div>
                </div>

                <div>
                    {travelDetails.map((detail, index) => (
                        <div className={style.room_detail_container} key={index}>
                            <span className={style.room_detail_title}>Travel {index + 1}</span>
                            <FloatLabel>
                                <InputText
                                    className={style.input_text}
                                    id={`nom_ville_input_${index}`}
                                    type="text"
                                    value={detail.nom_ville}
                                    onChange={(e) =>
                                        handleChange(index, "nom_ville", e.target.value)
                                    }
                                />
                                <label htmlFor={`nom_ville_input_${index}`}>Nom ville</label>
                            </FloatLabel>
                            <FloatLabel>
                                <Calendar
                                    className={style.input_text}
                                    id={`date_trajet_input_${index}`}
                                    value={new Date(detail.date_trajet)} // Convertit la date en objet Date
                                    onChange={(e) =>
                                        handleChange(index, "date_trajet", e.value.toISOString().split("T")[0])
                                    } // Formate la date en 'YYYY-MM-DD'
                                    dateFormat="yy-mm-dd" // Formatage de la date
                                    placeholder="Sélectionnez une date"
                                />
                                <label htmlFor={`date_trajet_input_${index}`}>Date du trajet</label>
                            </FloatLabel>
                            <FloatLabel>
                                <InputText
                                    className={style.input_text}
                                    id={`description_trajet_input_${index}`}
                                    type="text"
                                    value={detail.description_trajet}
                                    onChange={(e) =>
                                        handleChange(index, "description_trajet", e.target.value)
                                    }
                                />
                                <label htmlFor={`description_trajet_input_${index}`}>Description trajet</label>
                            </FloatLabel>

                        </div>
                    ))}
                    {/* Bouton pour dupliquer les champs */}
                    <button
                        type="button"
                        onClick={handleAddField}
                        className={style.add_button}
                    >
                        Ajouter un trajet
                    </button>
                </div>


                <div className={style.room_description_container}>
                    <span className={style.room_description_title}>Trip description</span>
                    <textarea className={style.room_description_textarea} id="description_input" type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className={style.button_list}>
                    <Button className="button-secondary" raised label="Cancel" />
                    <Button onClick={handleSubmit} label="+ Add new trip" className="button-primary" />
                </div>
            </div>

            <Dialog draggable={false} visible={visibleInclude} onHide={() => setVisibleInclude(false)} footer={addButtonIncluded} header="Add included">
                <InputText />
            </Dialog>

            <Dialog draggable={false} visible={visibleNotInclude} onHide={() => setVisibleNotInclude(false)} footer={addButtonNotIncluded} header="Add not included">
                <InputText />
            </Dialog>
        </>
    )
}