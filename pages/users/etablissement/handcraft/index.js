import AppTopbar from "@/layouts/AppTopbar"
import Head from "next/head"
import style from './../../../../style/pages/users/etablissement/etablissement.module.css';
import { Button } from "primereact/button"
import { Image } from "primereact/image"
import { Stepper } from "primereact/stepper"
import { StepperPanel } from "primereact/stepperpanel"
import { Rating } from "primereact/rating";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Dialog } from "primereact/dialog";
import { Chip } from 'primereact/chip';
import { Tooltip } from "primereact/tooltip";
import { Toast } from "primereact/toast";


export default function Handcraft() {
    const toast = useRef(null);
    const [rateValue, setRateValue] = useState(0);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [nif, setNif] = useState('');
    const [address, setAddress] = useState('');
    const [stat, setStat] = useState('');
    const [countryCode, setCountryCode] = useState('+261');
    const [countryOptions, setCountryOptions] = useState();

    const router = useRouter();
    const [deleteChip, setDeleteChip] = useState(false);

    const [socialLink, setSocialLink] = useState([]);
    const [visible, setVisible] = useState(false);


    const [socialLabel, setSocialLabel] = useState();
    const [socialSelected, setSocialSelected] = useState();
    const [allSocial, setAllSocial] = useState([]);
    const getAllSocial = () => {
        fetch("/api/social")
            .then(res => res.json())
            .then(data => setAllSocial(data))
            .catch(error => console.log(error));
    }
    useEffect(() => {
        const fetchCountryCodes = async () => {
            try {
                const response = await fetch('/api/social/countryCodes');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCountryOptions(data);
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        fetchCountryCodes();
    }, []);

    useEffect(() => {
        getAllSocial();
    }, [])

    const [socialLabelUpdat, setSocialLabelUpdat] = useState();



    const saveToLocalStorage = () => {
        if (name && phone && nif && address && stat) {
            const email = localStorage.getItem("email_etablissement");

            const data = {
                nom: name,
                responsable: null,
                email: email,
                telephone: `${countryCode}${phone}`,
                address: address,
                stat: stat,
                nif: nif,
            };

            localStorage.setItem("formData", JSON.stringify(data));

            setTimeout(() => {
                router.push("/users/etablissement/addInfoUser");
            }, 3000);
        } else {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please complete all fields',
                life: 3000,
            });
        }
    };
    const addSocialLink = () => {
        const allSocialCopy = [];
        allSocial.map((social) => {
            if (socialSelected != social) {
                allSocialCopy.push({
                    id: social.id,
                    label: social.label,
                    icon: social.icon
                });
            }
        })
        setAllSocial(allSocialCopy);
        setSocialSelected();
        const socialLinkCopy = [...socialLink];
        socialLinkCopy.push({
            icon: socialSelected.icon,
            label: socialLabel,
            visible: false
        });
        setSocialLabel();
        setSocialLink(socialLinkCopy);
        setVisible(false);
    }

    const updateSocialLink = (social) => {
        const socialLinkCopy = [];
        socialLink.map((s) => {
            if (social == s) {
                socialLinkCopy.push({
                    icon: s.icon,
                    label: socialLabelUpdat,
                    visible: false
                });
                setSocialLabelUpdat();
            }
            else {
                socialLinkCopy.push({
                    icon: s.icon,
                    label: s.label,
                    visible: s.visible
                });
            }
        })
        setSocialLink(socialLinkCopy);
    }

    const deleteSocialLink = (social) => {
        setDeleteChip(true);
        const socialLinkCopy = [];
        socialLink.map((s) => {
            setSocialLabelUpdat();
            if (social != s) {
                socialLinkCopy.push({
                    icon: s.icon,
                    label: s.label,
                    visible: s.visible
                });
            }
        })
        setSocialLink(socialLinkCopy);
        setDeleteChip(false);
    }

    const detailSocial = (social, event) => {
        if (event.ctrlKey) {
            router.push(social.label);
        }
        else {
            if (!deleteChip) {
                const socialLinkCopy = [];
                socialLink.map((s) => {
                    if (social == s) {
                        socialLinkCopy.push({
                            icon: s.icon,
                            label: s.label,
                            visible: true
                        });
                        setSocialLabelUpdat(s.label);
                    }
                    else {
                        socialLinkCopy.push({
                            icon: s.icon,
                            label: s.label,
                            visible: s.visible
                        });
                    }
                })
                setSocialLink(socialLinkCopy);
            }
        }
    }

    const hideSocialDetail = (social) => {
        const socialLinkCopy = [];
        socialLink.map((s) => {
            if (social == s) {
                socialLinkCopy.push({
                    icon: s.icon,
                    label: s.label,
                    visible: false
                });
            }
            else {
                socialLinkCopy.push({
                    icon: s.icon,
                    label: s.label,
                    visible: s.visible
                });
            }
        })
        setSocialLink(socialLinkCopy);
    }



    const socialOptionTemplate = (option) => {
        return (
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <i className={option.icon} />
                {option.label}
            </div>
        );
    };


    return (
        <>
            <div className={style.container}>
                <div className={style.left_container}>
                    <Image alt="logo" src="/images/logo-aftrip.png" />
                    <Stepper activeStep={2} linear className={style.stepper}>
                        <StepperPanel></StepperPanel>
                        <StepperPanel></StepperPanel>
                        <StepperPanel></StepperPanel>
                        <StepperPanel></StepperPanel>
                    </Stepper>
                </div>

                <div className={style.right_container}>
                    <div className={style.top_container}>
                        <span className={style.top_title}>Create your etablissement account</span>
                        <span className={style.top_subtitle}>Please enter information about your handcraft</span>
                    </div>

                    <div className={style.accommodation_1_parent}>
                        <div className={style.accommodation_1_container}>
                            <div className={style.left_accommodation_1}>
                                <FloatLabel>
                                    <InputText
                                        id="input_name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    <label style={{ display: "flex", alignItems: "center", gap: "8px" }} htmlFor="input_name">
                                        <i className="pi pi-warehouse" />
                                        Name
                                    </label>
                                </FloatLabel>
                                <FloatLabel>
                                    <div className="phone-input-container" style={{ display: "flex", alignItems: "center" }}>
                                        <Dropdown
                                        className={style.labelContact}
                                            pt={{
                                                trigger: { style: { display: "none", width: "100%" } }
                                            }}
                                            value={countryCode}
                                            options={countryOptions}
                                            onChange={(e) => { setCountryCode(e.value); }}
                                            optionLabel="label"
                                            optionValue="value"
                                        />
                                        <FloatLabel>
                                            <InputText className={style.inputContact}
                                                id="input_phone"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                            />
                                            <label style={{ display: "flex", alignItems: "center", gap: "8px" }} htmlFor="input_phone">
                                                <i className="pi pi-phone" />
                                                Phone
                                            </label>
                                        </FloatLabel>
                                    </div>
                                </FloatLabel>
                            </div>

                            <div className={style.right_accommodation_1}>
                                <FloatLabel>
                                    <InputText
                                        id="input_nif"
                                        value={nif}
                                        onChange={(e) => setNif(e.target.value)}
                                    />
                                    <label style={{ display: "flex", alignItems: "center", gap: "8px" }} htmlFor="input_nif">
                                        <i className="pi pi-credit-card" />
                                        NIF
                                    </label>
                                </FloatLabel>

                                <FloatLabel>
                                    <InputText
                                        id="input_address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                    <label style={{ display: "flex", alignItems: "center", gap: "8px" }} htmlFor="input_address">
                                        <i className="pi pi-map-marker" />
                                        Address
                                    </label>
                                </FloatLabel>

                                <FloatLabel>
                                    <InputText
                                        id="input_stat"
                                        value={stat}
                                        onChange={(e) => setStat(e.target.value)}
                                    />
                                    <label style={{ display: "flex", alignItems: "center", gap: "8px" }} htmlFor="input_stat">
                                        <i className="pi pi-credit-card" />
                                        STAT
                                    </label>
                                </FloatLabel>
                            </div>
                        </div>
                        <Button onClick={() => setVisible(true)} className={style.addSocial} label="Add social link" icon="pi pi-plus" />
                        <div className={style.chip_container}>
                            {socialLink.map((social, key) => {
                                return (<>
                                    <Tooltip target="#chip" />
                                    <Chip id="chip" data-pr-tooltip="Ctrl+Key : aperçu" data-pr-position="right" data-pr-at="right+5 top" data-pr-my="left center-2" style={{ cursor: "pointer" }} onClick={(event) => detailSocial(social, event)} label={social.label} icon={social.icon} removable onRemove={() => deleteSocialLink(social)} />
                                </>
                                )
                            })}
                        </div>
                        <Button onClick={saveToLocalStorage} style={{ width: "60%" }} className="button-primary" label="Continue" />
                    </div>

                </div>
            </div>

            <Dialog visible={visible} onHide={() => setVisible(false)}>
                <Dropdown
                    value={socialSelected}
                    onChange={(e) => setSocialSelected(e.value)}
                    placeholder="Social link"
                    options={allSocial}
                    optionLabel="label"
                    itemTemplate={socialOptionTemplate}
                />
                <InputText value={socialLabel} onChange={(e) => setSocialLabel(e.target.value)} />
                <Button label="test" onClick={addSocialLink} />
            </Dialog>

            {socialLink.map((social, index) => {
                return (
                    <Dialog draggable={false} key={index} visible={social.visible} onHide={() => hideSocialDetail(social)}>
                        <InputText value={socialLabelUpdat} onChange={(e) => setSocialLabelUpdat(e.target.value)} />
                        <Button onClick={() => updateSocialLink(social)} icon="pi pi-pencil" label="Upadte" />
                    </Dialog>
                )
            })}
            <Toast ref={toast} />

        </>
    )
}

Handcraft.getLayout = function getLayout(page) {
    return (
        <>
            <Head>
                <title>Handcraft</title>
            </Head>
            <AppTopbar />
            {page}
        </>
    )
}