import Head from "next/head";
import style from './../../../style/pages/responsable/accommodation/addNewRoom.module.css';
import { useEffect, useRef, useState, useContext } from "react";
import { Image } from "primereact/image";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast"; // Import Toast
import RoomAmenities from "@/components/RoomAmenities";
import { UrlConfig } from "@/util/config";
import ResponsableLayoutContext from "@/layouts/context/responsableLayoutContext";
import { getResponsableAccessToken } from "@/util/Cookies";
import imageCompression from 'browser-image-compression';

export default function AddNewRoom() {
    const [typeChambre, setTypeChambre] = useState([]);
    const inputRef = useRef(null);
    const [selectedType, setSelectedType] = useState();
    const [selectedStatus, setSelectedStatus] = useState();
    const [price, setPrice] = useState();
    const [fileImages, setFileImages] = useState([]);
    const [amenities, setAmenities] = useState([]);
    const [listImage, setListImage] = useState([]);
    const [description, setDescription] = useState("");
    const { user } = useContext(ResponsableLayoutContext);
    const id = user ? user.id_etablissement : 0;
    const toast = useRef(null); // Create reference for Toast
    const [missingFields, setMissingFields] = useState({});

    const handleClick = () => {
        inputRef.current.click();
    };

    const handleImageClick = (index) => {
        setListImage(prevList => prevList.filter((_, i) => i !== index));
        setFileImages(prevFiles => prevFiles.filter((_, i) => i !== index));
    };
    const handleFileUpload = async () => {
        const files = Array.from(inputRef.current.files);

        // Filtrer les fichiers pour ne garder que les images
        const validFiles = files.filter(file => file.type.startsWith('image/'));

        // Fonction pour compresser les images
        const compressImage = async (file) => {
            try {
                const compressedFile = await imageCompression(file, {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920
                });

                // Ajouter l'extension du fichier d'origine au fichier compressé
                const extension = file.name.split('.').pop();
                const newFile = new File([compressedFile], `${file.name}.${extension}`, {
                    type: file.type,
                });

                return newFile;
            } catch (error) {
                console.error('Error compressing file:', file.name, error);
                return null;
            }
        };

        // Compresser toutes les images et filtrer les erreurs
        const compressedFiles = await Promise.all(validFiles.map(file => compressImage(file)));
        const validCompressedFiles = compressedFiles.filter(file => file !== null);

        // Créer les URL d'images uniquement pour les fichiers valides et compressés
        const newImageUrls = validCompressedFiles.map(file => URL.createObjectURL(file));

        // Mettre à jour les états avec les nouvelles images
        setListImage(prevList => [...prevList, ...newImageUrls]);
        setFileImages(prevFiles => [...prevFiles, ...validCompressedFiles]);
    };



    useEffect(() => {
        // getResponsableAccessToken().then((access) => {
        fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/type-chambres/`, {
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${access}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setTypeChambre(data);
                } else {
                    console.error('Expected an array but got:', data);
                }
            })
            .catch(error => console.error('Erreur lors de la récupération des données :', error));
        // });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Collecting missing fields
        const newMissingFields = {
            name: !document.getElementById('name_input').value,
            type: !selectedType,
            capacity: !document.getElementById('capacity_input').value,
            price: !price,
            avalaible: !selectedStatus,
            description: !description,
        };

        setMissingFields(newMissingFields);

        // Check if any fields are missing
        if (Object.values(newMissingFields).some(isMissing => isMissing)) {
            if (toast.current) { // Vérification de la référence
                toast.current.show({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'All fields are required',
                    life: 3000
                });
            }
            return;
        }
        

        const formData = new FormData();
        formData.append('nom_chambre', document.getElementById('name_input').value);
        formData.append('hebergement', id);
        formData.append('chambre', selectedType.id);
        formData.append('capacite', document.getElementById('capacity_input').value);
        formData.append('prix_nuit_chambre', price);
        formData.append('disponible_chambre', selectedStatus);
        formData.append('description', description);

        fileImages.forEach((file, index) => {
            formData.append(`images[${index}]`, file);
        });

        amenities.forEach((accessory, index) => {
            formData.append(`accessories[${index}]`, accessory.id);
        });
        await handleAddRoom(formData);

    };
    const handleAddRoom = async (formData) => {
        try {
            // Attendre l'access token
            const access = await getResponsableAccessToken();

            // Faire l'appel à l'API pour ajouter la chambre
            const response = await fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/add-hebergement-chambre/`, {
                method: 'POST',
                headers: {
                    // 'Authorization': `Bearer ${access}`,
                },
                body: formData
            });
            console.log(formData);
            const data = await response.json();

            if (response.ok) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Room added successfully',
                    life: 2000
                });

                // Réinitialiser les champs après un délai
                setTimeout(() => {
                    setTypeChambre([]);
                    setSelectedType(null);
                    setSelectedStatus(null);
                    setPrice(null);
                    setFileImages([]);
                    setAmenities([]);
                    setListImage([]);
                    setDescription("");

                    // Recharger la page
                    window.location.reload();
                }, 2000);
            } else {
                throw new Error(data.message || 'Failed to add room');
            }
        } catch (error) {
            console.error('Error:', error);
            if (toast.current) { // Vérification de la référence
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to add room',
                    life: 3000
                });
            }
        }
        
    };

    return (
        <>
            <Head>
                <title>Add new Room</title>
            </Head>

            <Toast ref={toast} /> {/* Toast Component */}

            <div className={style.top_container}>
                <div className={style.top_container_title_container}>
                    <span className={style.top_container_title}>Room</span>
                    <span className={style.top_container_subtitle}>{user ? user.nom_hebergement : null}</span>
                </div>
            </div>

            <div className={style.container}>
                <div className={style.image_container}>
                    <div onClick={handleClick} className={style.button_image}>
                        <i className="pi pi-plus" />
                        <span>Add image</span>
                        <input ref={inputRef} onChange={handleFileUpload} type="file" accept="image/*" style={{ display: "none" }} />
                    </div>
                    {listImage.map((image, index) => (
                        <div key={index} className={style.image_add_container}>
                            <Image imageClassName={style.image} src={image} alt="image" />
                            <Button
                                icon="pi pi-trash"
                                className={style.delete_icon}
                                onClick={() => handleImageClick(index)}
                                aria-label="Delete"
                            />
                        </div>
                    ))}
                </div>
                <div className={style.room_detail_container}>
                    <span className={style.room_detail_title}>Room details</span>
                    <div className={style.room_detail}>
                        <FloatLabel>
                            <InputText className={`${style.input_text} ${missingFields.name ? style.input_missing : ''}`} id="name_input" type="text" />
                            <label htmlFor="name_input">Name</label>
                        </FloatLabel>
                        <FloatLabel>
                            <Dropdown
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.value)}
                                options={typeChambre}
                                optionLabel="type_chambre"
                                className={`${style.dropdown} ${missingFields.type ? style.input_missing : ''}`}
                            />
                            <label htmlFor="type_select">Type</label>
                        </FloatLabel>
                        <FloatLabel>
                            <InputText className={`${style.input_text} ${missingFields.capacity ? style.input_missing : ''}`} id="capacity_input" type="text" />
                            <label htmlFor="capacity_input">Capacity</label>
                        </FloatLabel>
                        <FloatLabel>
                            <InputNumber className={`${style.input_text} ${missingFields.price ? style.input_missing : ''}`} id="price_input" value={price}
                                onChange={(e) => setPrice(e.value)} />
                            <label htmlFor="price_input">Price per night</label>
                        </FloatLabel>
                        <FloatLabel>
                            <InputNumber className={`${style.input_text} ${missingFields.avalaible ? style.input_missing : ''}`}
                                id="status_select" value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.value)} />
                            {/* <Dropdown
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.value)}
                                options={statusOptions}
                                optionLabel="name"
                                className={`${style.dropdown} ${missingFields.status ? style.input_missing : ''}`}
                            /> */}
                            <label htmlFor="status_select">Avalaible rooms

                            </label>
                        </FloatLabel>
                    </div>
                </div>
                <div className={style.room_ammenties_container}>
                    <span className={style.room_ammenties_title}>Room amenities</span>
                    <RoomAmenities setAmenities={setAmenities} selectedAmenities={amenities} />
                </div>
                <div className={style.room_description_container}>
                    <span className={style.room_description_title}>Room description</span>
                    <textarea
                        className={`${style.room_description_textarea} ${missingFields.description ? style.input_missing : ''}`}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className={style.button_submit}>
                    <Button className={style.button_add} label="Add Room" onClick={handleSubmit} />
                    <Button className={style.button_reset} label="Reset" onClick={() => {

                        setSelectedType(null);
                        setSelectedStatus(null);
                        setPrice(null);
                        setFileImages([]);
                        setAmenities([]);
                        setListImage([]);
                        setDescription("");

                        // Recharger la page

                    }} />
                </div>
            </div>
        </>
    );
}
