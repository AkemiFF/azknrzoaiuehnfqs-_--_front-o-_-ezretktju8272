import Head from "next/head";
import style from '@/style/pages/responsable/accommodation/addNewRoom.module.css';
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
import { useRouter } from "next/router";

export default function AddNewRoom() {
    const [typeChambre, setTypeChambre] = useState([]);
    const [imageFile, setImageFile] = useState();
    const inputRef = useRef(null);
    const [selectedType, setSelectedType] = useState();
    const [selectedStatus, setSelectedStatus] = useState();
    const [price, setPrice] = useState();
    const [fileImages, setFileImages] = useState([]);
    const [amenities, setAmenities] = useState([]);
    const [listImage, setListImage] = useState([]);
    const [description, setDescription] = useState();
    const { user } = useContext(ResponsableLayoutContext);
    const id = user ? user.id_etablissement : 0;
    const toast = useRef(null); // Create reference for Toast
    const [missingFields, setMissingFields] = useState({});
    const router = useRouter();
    const { id_chambre } = router.query
    const [amenitiesEdit, setAmenitiesEdit] = useState(false);
    const [nomChambre, setNomChambre] = useState("");
    const [capacity, setCapacity] = useState(false);

    const handleClick = () => {
        inputRef.current.click();
    };


    const handleImageClick = (index) => {
        setListImage(prevList => prevList.filter((_, i) => i !== index));
        setFileImages(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    useEffect(() => {
        fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/type-chambres/`)
            .then(response => response.json())
            .then(data => setTypeChambre(data))
            .catch(error => console.error('Erreur lors de la récupération des données :', error));
    }, []);


    useEffect(() => {
        if (id_chambre) {
            fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/get-hebergement-chambre/${id_chambre}/`)
                .then(res => res.json())
                .then(data => {
                    const dict = { id: data.chambre, type_chambre: data.type_chambre, nombre_min_personnes: 1, nombre_max_personnes: 2 }
                    const accessoires = data.accessoires_list.map(accessoire => ({
                        id: accessoire.accessoire_chambre.id,
                        nom_accessoire: accessoire.accessoire_chambre.nom_accessoire,
                    }));

                    setSelectedType(dict);
                    setAmenitiesEdit(data.accessoires_list);
                    setAmenities(accessoires);
                    setNomChambre(data.nom_chambre);
                    setPrice(data.prix_nuit_chambre);
                    setCapacity(data.capacite);
                    setSelectedStatus(data.disponible_chambre);
                    setDescription(data.description);
                    setListImage(data.images.map(image => handleImage(image.content)));
                    setFileImages(data.images);
                })
                .catch(err => console.error(err));

        }
    }, [id_chambre]);
    const handleFileUpload = () => {
        const files = inputRef.current.files;

        // Function to convert a file to a base64 string
        const convertToBase64 = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(file);
            });
        };

        if (files.length > 0) {
            const file = files[0];

            if (file.type.startsWith('image/')) {
                convertToBase64(file)
                    .then(base64 => {
                        // Add base64 image data to listImage state
                        setListImage(prevList => [...prevList, base64]);

                        // Update fileImages state with the new file
                        setFileImages(prevFiles => [...prevFiles, file]);

                    })
                    .catch(error => console.error('Error converting file to base64:', error));
            } else {
                console.error('Selected file is not an image');
            }
        }
    };



    // const handleSubmit = (e) => {
    //     e.preventDefault(); // Prevent default form submission

    //     // Collecting missing fields
    //     const newMissingFields = {
    //         name: !nomChambre,
    //         type: !selectedType,
    //         capacity: !capacity,
    //         price: !price,
    //         status: !selectedStatus,
    //         description: !description,
    //     };

    //     setMissingFields(newMissingFields);

    //     // Check if any fields are missing
    //     // if (Object.values(newMissingFields).some(isMissing => isMissing)) {
    //     //     toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'All fields are required', life: 3000 });
    //     //     return;
    //     // }

    //     const formData = new FormData();
    //     formData.append('nom_chambre', nomChambre);
    //     formData.append('hebergement', id);
    //     formData.append('chambre', selectedType.id);
    //     formData.append('capacite', capacity);
    //     formData.append('prix_nuit_chambre', price);
    //     formData.append('disponible_chambre', selectedStatus);
    //     formData.append('description', description);

    //     fileImages.forEach((file, index) => {
    //         formData.append(`images[${index}]`, file);
    //     });

    //     amenities.forEach((accessory, index) => {
    //         formData.append(`accessories[${index}]`, accessory.id);
    //     });

    //     console.log([...formData]); // Log FormData for debugging (if needed)

    //     sendFormData(formData);
    // };
    const base64ToFile = (base64, fileName) => {
        const [metadata, base64Data] = base64.split(',');
        const mimeString = metadata.match(/:(.*?);/)[1];
        const byteCharacters = atob(base64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            byteArrays.push(new Uint8Array(byteNumbers));
        }

        return new File([new Blob(byteArrays, { type: mimeString })], fileName, { type: mimeString });
    };



    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission

        const newMissingFields = {
            name: !nomChambre,
            type: !selectedType,
            capacity: !capacity,
            price: !price,
            status: !selectedStatus,
            description: !description,
        };

        setMissingFields(newMissingFields);

        if (Object.values(newMissingFields).some(isMissing => isMissing)) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'All fields are required', life: 3000 });
            return;
        }

        const formData = new FormData();
        formData.append('nom_chambre', nomChambre);
        formData.append('hebergement', id);
        formData.append('chambre', selectedType.id);
        formData.append('capacite', capacity);
        formData.append('prix_nuit_chambre', price);
        formData.append('disponible_chambre', selectedStatus);
        formData.append('description', description);
        console.log(listImage);
        // sendFormData(formData);

        // Convert base64 images to File objects and add them to formData
        const imagePromises = listImage.map((base64, index) => {
            return new Promise((resolve, reject) => {
                const fileName = `image_${index}.jpeg`; // Nom du fichier par défaut
                try {
                    const fileObj = base64ToFile(base64, fileName);
                    formData.append(`images[${index}]`, fileObj);
                    resolve();
                } catch (error) {
                    reject(`Failed to convert base64 to file: ${error}`);
                }
            });
        });

        Promise.all(imagePromises)
            .then(() => {
                amenities.forEach((accessory, index) => {
                    formData.append(`accessories[${index}]`, accessory.id);
                });

                sendFormData(formData);
            })
            .catch(error => {
                console.error('Error processing images:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to process images', life: 3000 });
            });


    };


    const sendFormData = (formData) => {
        fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/edit-hebergement-chambre/${id_chambre}/`, {
            method: 'PATCH',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errData => {
                        throw new Error(errData.detail || 'Failed to process the request.');
                    });
                }
                return response.json();
            })
            .then(data => {
                // Si la réponse est réussie, afficher le toast de succès
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Room edited', life: 2000 });

                setTimeout(() => {
                    // window.location.reload();
                }, 2000);
            })
            .catch(error => {
                // En cas d'erreur, afficher le message d'erreur dans le toast
                console.error('Error:', error.message);
                toast.current.show({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to add room', life: 3000 });
            });
    };

    const handleImage = (base64String) => {
        return `data:image/jpeg;base64,${base64String}`;
    };

    return (
        <>
            <Head>
                <title>Edit Room</title>
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
                            <Image
                                imageClassName={style.image}
                                src={image}
                                alt="image"
                            // onClick={() => handleImageClick(index)}
                            />
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
                            <InputText
                                className={`${style.input_text} ${missingFields.name ? style.input_missing : ''}`}
                                id="name_input"
                                value={nomChambre} // Ensure `nomChambre` is always defined
                                onChange={(e) => setNomChambre(e.target.value)} // Use `e.target.value` to get the value
                            />

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
                            <InputText
                                className={`${style.input_text} ${missingFields.capacity ? style.input_missing : ''}`}
                                id="capacity_input"
                                type="number"
                                value={capacity || ""}
                                onChange={(e) => setCapacity(Number(e.target.value))} // Convert value to number
                            />
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
                    <Button className={style.button_add} label="Save" onClick={handleSubmit} />
                    {/* <Button className={style.button_reset} label="Reset" onClick={() => {
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

                    }} /> */}
                </div>
            </div>
        </>
    );
}
