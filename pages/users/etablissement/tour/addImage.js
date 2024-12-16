import AppTopbar from "@/layouts/AppTopbar";
import Head from "next/head";
import style from './../../../../style/pages/users/etablissement/etablissement.module.css';
import { Stepper } from "primereact/stepper";
import { Image } from "primereact/image";
import { StepperPanel } from "primereact/stepperpanel";
import { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import UrlConfig from "@/util/config";
import { getCsrfTokenDirect } from "@/util/csrf";
import Cookies from "js-cookie";
import { Galleria } from "primereact/galleria";
import WaitSpinner from "@/components/WaitSpinner";
import { Toast } from "primereact/toast";
import imageCompression from 'browser-image-compression';

export default function AddImage() {

    const [info, setInfo] = useState();
    const [isSpinnerVisible, setIsSpinnerVisible] = useState(false);
    const toast = useRef(null);
    const inputFileRef = useRef();
    const imageRef = useRef();
    const router = useRouter();
    const inputRef = useRef(null);
    const [fileImages, setFileImages] = useState([]);
    const [listImage, setListImage] = useState([]);
    const [images, setImages] = useState(null);
    const responsiveOptions = [
        {
            breakpoint: '991px',
            numVisible: 4
        },
        {
            breakpoint: '767px',
            numVisible: 3
        },
        {
            breakpoint: '575px',
            numVisible: 1
        }
    ];


    useEffect(() => {
        const updatedImages = fileImages.map(file => {
            const imageUrl = URL.createObjectURL(file);
            return {
                itemImageSrc: imageUrl,
                thumbnailImageSrc: imageUrl,
                alt: file.name
            };
        });

        setImages(updatedImages);
    }, [fileImages]);

    const itemTemplate = (item) => {
        // return <Image src={item.itemImageSrc} alt={item.alt} style={{ width: '100%' }} />
        return <Image src={item.itemImageSrc} className={style.selectedItem} alt={item.alt} />
    }

    const thumbnailTemplate = (item) => {
        return <Image src={item.thumbnailImageSrc} alt={item.alt} style={{ width: '10px' }} className={style.listItems} />
    }
    const addImage = () => {
        inputFileRef.current.click();
    }



    useEffect(() => {
        if (typeof window !== 'undefined') {
            const responsableInfo = JSON.parse(localStorage.getItem('responsable_info'));
            setInfo(responsableInfo);
        }
    }, []);
    const handleClick = () => {
        inputRef.current.click();
    };
    const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const response = await fetch(url, options);
                if (response.ok) {
                    return response;
                }
                if (attempt === retries) {
                    throw new Error(`Failed after ${retries} attempts`);
                }
            } catch (error) {
                if (attempt === retries) {
                    throw error;
                }
                await new Promise(res => setTimeout(res, delay));
            }
        }
    };

    const handleFileUpload = async () => {
        const files = Array.from(inputRef.current.files);

        // Filtrer les fichiers pour ne garder que les images
        const validFiles = files.filter(file => file.type.startsWith('image/'));

        // Fonction pour compresser les images
        const compressImage = async (file) => {
            try {
                const compressedFile = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920 });
                return compressedFile;
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

    const handleSubmitImages = async () => {
        if (fileImages.length === 0) {
            console.log("No images to upload");
            setIsSpinnerVisible(false);
            return;
        }

        const info = JSON.parse(localStorage.getItem("responsable_info")); // Assurez-vous que "responsable_info" est défini
        const formData = new FormData();

        formData.append('id', info.id_etablissement);

        fileImages.forEach((file, index) => {
            formData.append(`image_${index}`, file);
        });

        try {
            const csrfToken = await getCsrfTokenDirect();

            const response = await fetchWithRetry(
                `${UrlConfig.apiBaseUrl}/api/tour/add-image/`,
                {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': csrfToken
                    },
                    body: formData,
                }
            );

            const data = await response.json();
            console.log("Images uploaded successfully:", data);
            setFileImages([]); // Clear file images after successful upload
            setTimeout(() => {
                setIsSpinnerVisible(false);
                router.push("/users/etablissement/we");
            }, 1000);
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: `Error uploading images: ${error.message}`,
                life: 5000,
            });
            console.error("Error uploading images:", error);
            setIsSpinnerVisible(false);
        }
    };

    const addImageFini = async () => {
        setIsSpinnerVisible(true);
        await handleSubmitImages();
    };
    return (
        <div className={style.container}>
            <div className={style.left_container}>
                <Image alt="logo" src="/images/logo-aftrip.png" width={100} height={50} />
                <Stepper activeStep={3} linear className={style.stepper}>
                    <StepperPanel></StepperPanel>
                    <StepperPanel></StepperPanel>
                    <StepperPanel></StepperPanel>
                    <StepperPanel></StepperPanel>
                </Stepper>
            </div>
            <div className={style.right_container}>
                <div className={style.top_container}>
                    <span className={style.top_title}>Create your etablissement account</span>
                    <span className={style.top_subtitle}>Please add some images to your accommodation</span>
                </div>


                <div className={style.card}>

                    <div onClick={handleClick} className={style.button_image}>
                        <i className="pi pi-plus" />
                        <span>Add image</span>
                        <input
                            ref={inputRef}
                            onChange={handleFileUpload}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            multiple
                        />
                    </div> <Galleria value={images} className={style.imageContainerPrime} responsiveOptions={responsiveOptions} numVisible={5} style={{}}
                        item={itemTemplate} thumbnail={thumbnailTemplate} />

                    <Button
                        onClick={() => {
                            setListImage([]);
                            setFileImages([]);
                            setImages([]);
                        }}
                        className="button-secondary"
                        label="Reset"
                    />

                </div>



                <Button onClick={addImageFini} className="button-primary" label="Continue" />
            </div>
            <WaitSpinner visible={isSpinnerVisible} />
            <Toast ref={toast} />

        </div>
    );
}

AddImage.getLayout = function getLayout(page) {
    return (
        <>
            <Head>
                <title>Add Image</title>
            </Head>
            <AppTopbar />
            {page}
        </>
    )
}