import Head from "next/head";
import style from './../../../../style/pages/responsable/accommodation/setting.module.css';
import style_image from './../../../../style/pages/responsable/accommodation/addNewRoom.module.css';
import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import ResponsableLayoutContext from "@/layouts/context/responsableLayoutContext";
import { getResponsableAccessToken } from "@/util/Cookies";
import UrlConfig from "@/util/config";
import Map from "@/components/Map";
import { Image } from "primereact/image";
import imageCompression from 'browser-image-compression';
import { Menubar } from "primereact/menubar";
import style_profile from "./../../../../style/pages/responsable/accommodation/setting/profil.module.css";
import { InputTextarea } from "primereact/inputtextarea";

export default function Info() {
    const { user, setUser } = useContext(ResponsableLayoutContext);
    const router = useRouter();
    const inputRef = useRef(null);
    const [fileImages, setFileImages] = useState([]);
    const [description, setDescription] = useState([]);
    const [amenities, setAmenities] = useState([]);
    const [fetchedImages, setFetchedImages] = useState([]);
    const [isEditingImage, setIsEditingImage] = useState(false);
    const [isEditDescription, setIsEditDescription] = useState(false);
    const [listImage, setListImage] = useState([]);
    const [visibleEdit, setVisibleEdit] = useState(1);
    const [deletedImageIds, setDeletedImageIds] = useState([]);

    const handleClick = () => {
        inputRef.current.click();
    };

    const [menuSidebar, setMenuSidebar] = useState([
        { label: "Profil" },
        { label: "Info" },
        { label: "Commission" },
        { label: "Notification" },
        { label: "Security" },
        { label: "Help" }
    ]);

    const menu = 1;
    // Amenities Part
    useEffect(() => {
        const getDes = async () => {
            try {
                const access = await getResponsableAccessToken();

                fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/${user.id_etablissement}/description/`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access}`,
                    },

                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Erreur lors de la fetch');
                        }
                        return response.json();
                    })
                    .then(data => {

                        setDescription(data.description_hebergement);
                    })
                    .catch(err => console.error('Erreur lors de la mise à jour des informations personnelles:', err));

            } catch (error) {
                console.error('Erreur lors de la récupération du token:', error);
            }
        }

        getDes();
    }, [user]);

    // Image Part
    useEffect(() => {
        const getImages = async () => {
            try {
                const access = await getResponsableAccessToken();

                fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/${user.id_etablissement}/images/`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access}`,
                    },

                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Erreur lors de la fetch');
                        }
                        return response.json();
                    })
                    .then(data => {

                        setFetchedImages(data);
                        const imageUrls = data.map(image => `${UrlConfig.apiBaseUrl}${image.image}`);

                        setListImage(prevList => [...prevList, ...imageUrls]);
                    })
                    .catch(err => console.error('Erreur lors de la mise à jour des informations personnelles:', err));

            } catch (error) {
                console.error('Erreur lors de la récupération du token:', error);
            }
        }

        getImages();
    }, [user]);

    const handleCancel = () => {
        setDeletedImageIds([]);

        // Créer une liste d'URL d'images à ajouter
        const newImageUrls = fetchedImages.map(image => `${UrlConfig.apiBaseUrl}${image.image}`);

        // Vérifier quelles nouvelles images ne sont pas déjà dans la liste
        const uniqueNewImageUrls = newImageUrls.filter(url => !listImage.includes(url));

        // Mettre à jour la liste d'images avec les images uniques
        setListImage(prevList => [...prevList, ...uniqueNewImageUrls]);
    };
    const handleCancelDescription = () => {
        const getDes = async () => {
            try {
                const access = await getResponsableAccessToken();

                fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/${user.id_etablissement}/description/`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access}`,
                    },

                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Erreur lors de la fetch');
                        }
                        return response.json();
                    })
                    .then(data => {

                        setDescription(data.description_hebergement);
                    })
                    .catch(err => console.error('Erreur lors de la mise à jour des informations personnelles:', err));

            } catch (error) {
                console.error('Erreur lors de la récupération du token:', error);
            }
        }
        getDes();
    };

    const handleChangeDescription = async () => {
        try {
            const access = await getResponsableAccessToken();

            fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/${user.id_etablissement}/description/`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access}`,
                },
                body: JSON.stringify({ description_hebergement: description })

            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erreur lors de la fetch');
                    }
                    return response.json();
                })
                .then(data => {
                    setIsEditDescription(false);
                })
                .catch(err => console.error('Erreur lors de la mise à jour des informations personnelles:', err));

        } catch (error) {
            console.error('Erreur lors de la récupération du token:', error);
        }

    }
    const handleSubmit = async () => {
        try {
            const access = await getResponsableAccessToken();
            const formData = new FormData();

            // Ajouter les images à FormData
            fileImages.forEach((file, index) => {
                formData.append(`image_${index}`, file);
            });

            // Envoyer les images au serveur
            const response = await fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/${user.id_etablissement}/images/`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${access}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout des images');
            }

            const result = await response.json();
            console.log('Images ajoutées avec succès:', result);

            // setListImage([]);
            // setFileImages([]); 
            handleDelete();

            setIsEditingImage(false);

        } catch (error) {
            console.error('Erreur lors de l\'ajout des images:', error);
        }
    };
    const normalizedFetchedImages = fetchedImages.map(img => ({
        ...img,
        image: `${UrlConfig.apiBaseUrl}${img.image}`
    }));

    const handleImageClick = (index) => {
        if (index < 0 || index >= listImage.length) {
            console.error("Index invalide pour l'image.");
            return;
        }

        const imageUrl = listImage[index];
        const imageToRemove = normalizedFetchedImages.find(img => img.image === imageUrl);

        console.log("Image to Remove:", imageToRemove);

        setListImage(prevList => prevList.filter((_, i) => i !== index));
        setFileImages(prevFiles => prevFiles.filter((_, i) => i !== index));

        if (imageToRemove && imageToRemove.id) {
            setDeletedImageIds(prevDeletedIds => [...prevDeletedIds, imageToRemove.id]);
        }
    };


    const handleDelete = async () => {
        try {
            if (deletedImageIds.length > 0) {

                const access = await getResponsableAccessToken();
                const response = await fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/${user.id_etablissement}/images/`, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access}`,
                    },
                    body: JSON.stringify({ image_ids: deletedImageIds }),
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la suppression des images');
                }

                // Handle success
                console.log('Images supprimées avec succès');
                // Optionally, clear the list of deleted image IDs
                setDeletedImageIds([]);
            }
            else {
                console.log("no deleted");
            }
        } catch (error) {
            console.error('Erreur lors de la soumission des images supprimées:', error);
        }
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
    const items = [
        {
            // label: 'Description & Amenities',
            label: 'Description',
            icon: 'pi pi-home',
            command: () => {
                setVisibleEdit(1);
            }
        },
        {
            label: 'Etablishment Images',
            icon: 'pi pi-star',
            command: () => {
                setVisibleEdit(2);
            }
        },

        {
            label: 'Localisation',
            icon: 'pi pi-map',
            command: () => {
                setVisibleEdit(3);
            }
        }
    ];

    return (
        <>
            <Head>
                <title>Info Edit</title>
            </Head>

            <div className={style.container}>
                <div className={style.left_container}>
                    <div className={style.left_top_container}>
                        <span className={style.left_top_subtitle}>{menuSidebar[menu].label}</span>
                        <span className={style.left_top_title}>{user ? user.nom_hebergement : null}</span>

                    </div>
                    <div className={style.left_body_container}>
                        {menuSidebar.map((item, index) => {
                            return <Button key={index} onClick={() => router.push("/responsable/accommodation/setting/" + item.label.toLowerCase())} text className={menu == index ? "button-secondary" : style.text_button} raised={menu == index ? true : false} label={item.label} />
                        })}
                    </div>

                </div>
                <div className={style_image.right_body_container}>

                    <div className="card">
                        <Menubar model={items} />
                    </div>
                    {visibleEdit == 1 ? (
                        <div className={style_image.container}>
                            <InputTextarea disabled={!isEditDescription} value={description} onChange={(e) => setDescription(e.target.value)} rows={5} cols={30} />
                            {isEditDescription ? (
                                <>
                                    <Button
                                        text
                                        className={style_profile.button_edit}
                                        icon="pi pi-save"
                                        raised
                                        label="Save"
                                        onClick={() => handleChangeDescription()}
                                    />
                                    <Button
                                        text
                                        className={style_profile.button_cancel}
                                        icon="pi pi-cancel"
                                        raised
                                        label="Cancel"
                                        onClick={() => { handleCancelDescription(); setIsEditDescription(false); }}
                                    />
                                </>
                            ) : (
                                <Button
                                    text
                                    className={style_profile.button_edit}
                                    icon="pi pi-pen-to-square"
                                    raised
                                    label="Edit"
                                    onClick={() => { setIsEditDescription(!isEditDescription); }}
                                />
                            )}
                        </div>
                    ) : visibleEdit == 2 ? (
                        <div className={style_image.container}>

                            <div className={style_image.image_container} style={{
                                maxWidth: "45rem",
                                overflow: "hidden",
                                display: "flex",
                                flexWrap: "wrap"
                            }}>
                                {isEditingImage ? (
                                    <>
                                        <Button
                                            text
                                            className={style_profile.button_edit}
                                            icon="pi pi-save"
                                            raised
                                            label="Save"
                                            onClick={() => handleSubmit("hi")}
                                        />
                                        <Button
                                            text
                                            className={style_profile.button_cancel}
                                            icon="pi pi-cancel"
                                            raised
                                            label="Cancel"
                                            onClick={() => { setIsEditingImage(false); handleCancel(); }}
                                        />
                                    </>
                                ) : (
                                    <Button
                                        text
                                        className={style_profile.button_edit}
                                        icon="pi pi-pen-to-square"
                                        raised
                                        label="Edit"
                                        onClick={() => { setIsEditingImage(!isEditingImage); }}
                                    />
                                )}{isEditingImage ? (
                                    <div onClick={handleClick} className={style_image.button_image}>

                                        <><i className="pi pi-plus" /><span>Add image</span>
                                            <input ref={inputRef} onChange={handleFileUpload} type="file" accept="image/*" style={{ display: "none" }} multiple />
                                        </>

                                    </div>) : null}
                                {listImage.map((image, index) => (
                                    <div key={index} className={style_image.image_add_container}>
                                        <Image imageClassName={style_image.image} src={image} alt="image" />
                                        {isEditingImage ? (

                                            <Button
                                                icon="pi pi-trash"
                                                className={style_image.delete_icon}
                                                onClick={() => handleImageClick(index)}
                                                aria-label="Delete"
                                            />) : null}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : visibleEdit == 3 ? (
                        <div style={{ width: "100%", height: "10rem" }}>
                            <Map
                                style={{ width: "100%", height: 500 }}
                                lat={-18.9433924}
                                lng={47.5288271}
                                name="Hotel le Louvre & spa"
                            />
                        </div>

                    ) : null

                    }



                </div>
            </div>
        </>
    )
}