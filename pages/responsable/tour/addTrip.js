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
    const [imageFile,setImageFile]=useState();
    const inputRef = useRef(null);
    const [inclusionOptions, setInclusionOptions] = useState([]); // État pour stocker les inclusions
    const [selectedInclusion, setSelectedInclusion] = useState(null);
    const [transportOptions, setTransportOptions] = useState([]);
    const [selectedTransport, setSelectedTransport] = useState([]);
    const [IdEtablissement, setIdEtablissement] = useState(0);

    // États pour stocker date début et date fin séparément
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    useEffect(() => {
        setIdEtablissement(user.id_etablissement);
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

    const [visibleInclude,setVisibleInclude] = useState(false);
    const [visibleNotInclude,setVisibleNotInclude] = useState(false);

    const [listImage,setListImage] = useState([]);

    const handleClick=()=>{
        inputRef.current.click();
    }

    const handleFileUpload = () =>{
        const files = inputRef.current.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            const fileUrl=URL.createObjectURL(files[0]);
            const listImageCopy = [...listImage];
            listImageCopy.push(fileUrl);
            setListImage(listImageCopy);
        }
    }

    const addButtonIncluded = () =>{
        return <Button className={"button-primary"} label="Add included"/>
    }

    const addButtonNotIncluded = () =>{
        return <Button className={"button-primary"} label="Add not included"/>
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Collecting missing fields
        /* const newMissingFields = {
            name: !document.getElementById('name_input').value,
            type: !selectedType,
            capacity: !document.getElementById('capacity_input').value,
            price: !price,
            avalaible: !selectedStatus,
            description: !description,
        };

        setMissingFields(newMissingFields); */

        // Check if any fields are missing
       /*  if (Object.values(newMissingFields).some(isMissing => isMissing)) {
            if (toast.current) { // Vérification de la référence
                toast.current.show({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'All fields are required',
                    life: 3000
                });
            }
            return;
        } */
            const formattedInclusionOptions = selectedInclusion.map((inclusion) => (
                inclusion.code
           ));


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
            tour_operateur: IdEtablissement
        };
        
        
            /* fileImages.forEach((file, index) => {
                formData.append(`images[${index}]`, file);
            }); */

            console.log(tripData);

        await handleAddTrip(tripData);

    };

    const handleAddTrip = async (tripData) => {
        
        try {
            // Attendre l'access token
            const access = await getResponsableAccessToken();

            // Faire l'appel à l'API pour ajouter la chambre
            const response = await fetch(`${UrlConfig.apiBaseUrl}/api/tour/voyages/create/`, {
                method: 'POST',

                headers: { 
                    "Content-Type": "application/json",

                    // 'Authorization': `Bearer ${access}`,
                },
                body: JSON.stringify(tripData)
            });
    
            const data = await response.json();

            if (response.ok) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Trip added successfully',
                    life: 2000
                });

                // Réinitialiser les champs après un délai
                setTimeout(() => {
                    setName([]);
                    setDepart(null);
                    setPricePerPerson("");
                    setDateRange(null);
                    setDestination("");
                    setTotalPlace("");
                    setDistance("");
                    setDescription("");

                    // Recharger la page
                    window.location.reload();
                }, 2000);
            } else {
                throw new Error(data.message || 'Failed to add trip');
                console.log(response);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to add trip',
                life: 3000
            });
        }
    };

    return(
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
                <div  className={style.image_container}>
                    <div onClick={handleClick}  className={style.button_image}>
                        <i className="pi pi-plus"/>
                        <span>Add image</span>
                        <input value={imageFile} ref={inputRef} onChange={handleFileUpload} type="file" accept="image/*" style={{display:"none"}}/>
                    </div>
                    {listImage.map((image,index)=>{
                        return(
                            <div key={index} className={style.image_add_container}>
                                <Image imageClassName={style.image} src={image} alt="image"/>
                            </div>
                        )
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

                <div className={style.room_description_container}>
                    <span className={style.room_description_title}>Trip description</span>
                    <textarea  className={style.room_description_textarea} id="description_input" type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}/>
                </div>
                <div className={style.button_list}>
                    <Button className="button-secondary" raised label="Cancel"/>
                    <Button onClick={handleSubmit} label="+ Add new trip" className="button-primary" />
                </div>
            </div>

            <Dialog draggable={false} visible={visibleInclude} onHide={()=>setVisibleInclude(false)} footer={addButtonIncluded} header="Add included">
                <InputText/>
            </Dialog>

            <Dialog draggable={false} visible={visibleNotInclude} onHide={()=>setVisibleNotInclude(false)} footer={addButtonNotIncluded} header="Add not included">
                <InputText/>
            </Dialog>
        </>
    )
}