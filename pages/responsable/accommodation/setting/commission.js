import Head from "next/head";
import style from './../../../../style/pages/responsable/accommodation/setting.module.css';
import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import { Slider } from "primereact/slider";
import styleDropdown from '@/style/components/ListCheckbox.module.css';
import { getResponsableAccessToken } from "@/util/Cookies";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useTranslation } from "react-i18next";
import ResponsableLayoutContext from "@/layouts/context/responsableLayoutContext";
import UrlConfig from "@/util/config";
import { Toast } from "primereact/toast";

export default function Commission() {

    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const { t } = useTranslation();
    const { user } = useContext(ResponsableLayoutContext);
    const toast = useRef(null);



    const [menuSidebar, setMenuSidebar] = useState([
        { label: "Profil" },
        { label: "Info" },
        { label: "Commission" },
        { label: "Notification" },
        { label: "Security" },
        { label: "Help" }
    ]);


    const menu = 2;
    const [priceIntervalle, setPriceIntervalle] = useState([0, 100]);
    const [commission, setCommission] = useState(7);
    const [selectedCommission, setSelectedCommission] = useState(7);
    useEffect(() => {
        const getCommission = async () => {
            try {
                const access = await getResponsableAccessToken();
                fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/${user.id_etablissement}/commission/`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access}`,
                    },

                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Erreur lors de la mise à jour');
                        }
                        return response.json();
                    })
                    .then(data => {
                        setSelectedCommission(data.taux_commission)
                    })
                    .catch(err => console.error('Erreur lors de la mise à jour des informations personnelles:', err));

            } catch (error) {
                console.error('Erreur lors de la récupération du token:', error);
            }
        }
        getCommission();
    }, [user]);
    const priceByPourcentage = (percentage) => {
        const minValue = 7;
        const maxValue = 15;

        if (percentage < 0 || percentage > 100) {
            throw new Error("Le pourcentage doit être entre 0 et 100.");
        }

        const value = minValue + (percentage / 100) * (maxValue - minValue);


        return value.toFixed(2);
    }
    const filterPrice = (e) => {
        setCommission(e.value);
        let commission = priceByPourcentage(e.value);
        setSelectedCommission(commission);
    }
    const saveChange = async () => {
        handleSave().then(() => setIsEditing(!isEditing))

    }
    const policySections = [
        { key: 'overview', title: t('policy.overview.title'), content: t('policy.overview.text') },
        {
            key: 'commission_structure', title: t('policy.commission_structure.title'), content: [
                { key: 'standard_commission_rate', title: t('policy.commission_structure.standard_commission_rate.title'), content: t('policy.commission_structure.standard_commission_rate.text') },
                { key: 'commission_variations', title: t('policy.commission_structure.commission_variations.title'), content: t('policy.commission_structure.commission_variations.text') },
            ]
        },
        {
            key: 'commission_calculation', title: t('policy.commission_calculation.title'), content: [
                { key: 'booking_confirmation', title: t('policy.commission_calculation.booking_confirmation.title'), content: t('policy.commission_calculation.booking_confirmation.text') },
                { key: 'commissionable_amount', title: t('policy.commission_calculation.commissionable_amount.title'), content: t('policy.commission_calculation.commissionable_amount.text') },
            ]
        },
        {
            key: 'payment_terms', title: t('policy.payment_terms.title'), content: [
                { key: 'payment_schedule', title: t('policy.payment_terms.payment_schedule.title'), content: t('policy.payment_terms.payment_schedule.text') },
                { key: 'payment_method', title: t('policy.payment_terms.payment_method.title'), content: t('policy.payment_terms.payment_method.text') },
            ]
        },
        {
            key: 'dispute_resolution', title: t('policy.dispute_resolution.title'), content: [
                { key: 'dispute_submission', title: t('policy.dispute_resolution.dispute_submission.title'), content: t('policy.dispute_resolution.dispute_submission.text') },
                { key: 'dispute_resolution_process', title: t('policy.dispute_resolution.dispute_resolution_process.title'), content: t('policy.dispute_resolution.dispute_resolution_process.text') },
            ]
        },
        { key: 'policy_updates', title: t('policy.policy_updates.title'), content: t('policy.policy_updates.text') }
    ];
    const handleSave = async () => {
        try {
            const access = await getResponsableAccessToken();  // Get the access token
            const data = { "commission": selectedCommission }

            fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/${user.id_etablissement}/commission/`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access}`,  // Add the access token here
                },
                body: JSON.stringify(data),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erreur lors de la mise à jour');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Données mises à jour:', data);
                    toast.current.show({
                        severity: "info",
                        summary: "Info",
                        detail: "Commission changed to " + selectedCommission + "%",
                        life: 5000
                    });
                    setIsEditing(!isEditing);
                })
                .catch(err => console.error('Erreur lors de la mise à jour des informations personnelles:', err));

        } catch (error) {
            console.error('Erreur lors de la récupération du token:', error);
        }
    }


    return (
        <>
            <Head>
                <title>Commission</title>
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
                <div className={style.right_body_container}>
                    <div className={style.left_top_container}>
                        <span className={style.left_top_subtitle}>Accommodation</span>
                        <span className={style.left_top_title}>Please choose a commission for your etablishment</span>
                        <span className={style.left_top_title}><br></br></span>
                    </div>
                    <hr style={{ marginBottom: "3rem" }} />
                    <div style={{ display: "flex", flexDirection: "column" }} className={styleDropdown.checkbox_container}>
                        <Slider style={{ width: "100%" }} value={commission} disabled={!isEditing} onChange={filterPrice} />
                        <div className={styleDropdown.price}>
                            <span>{priceByPourcentage(priceIntervalle[0])} %</span>
                            <h1>{selectedCommission} %</h1>
                            <span>{priceByPourcentage(priceIntervalle[1])} %</span>
                        </div>
                    </div>
                    <hr />
                    <div style={{ display: "flex", gap: 20, alignItems: "flex-end", justifyContent: "flex-end", marginTop: "2rem" }}>
                        <Button
                            text
                            icon="pi pi-pen-to-square"
                            raised
                            label="Edit"
                            disabled={isEditing}
                            onClick={() => setIsEditing(!isEditing)}
                        />

                        <Button
                            text
                            icon="pi pi-pen-to-square"
                            raised
                            label="Save"
                            disabled={!isEditing}
                            onClick={() => saveChange()}
                        />
                    </div>
                    <br /> <span className={style.left_top_subtitle}>

                        Commission Policy
                    </span><hr /><br />

                    <div className={style.right_body_container}>
                        <Accordion multiple activeIndex={[0]}
                        >
                            {policySections.map(section => (
                                <AccordionTab key={section.key} header={section.title} >
                                    {Array.isArray(section.content) ? (
                                        section.content.map(subSection => (
                                            <div key={subSection.key}>
                                                <span><b>{subSection.title}</b></span>
                                                <p>{subSection.content}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>{section.content}</p>
                                    )}
                                </AccordionTab>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div >
            <Toast ref={toast} />
        </>
    )
}