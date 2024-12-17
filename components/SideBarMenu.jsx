import ResponsableLayoutContext from '@/layouts/context/responsableLayoutContext';
import style from '@/style/pages/responsable/accommodation/setting.module.css';
import style_profile from "@/style/pages/responsable/accommodation/setting/profil.module.css";
import fetchHotelDetails from '@/util/HotelDetails';
import { Button } from "primereact/button";
import { Skeleton } from 'primereact/skeleton';
import { useContext, useEffect, useState } from 'react';



export default function SideBarMenu({ router, menu }) {
    const { user } = useContext(ResponsableLayoutContext);
    const [nameHotel, setNameHotel] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const menuSidebar = [
        { label: "Profil", icon: 'pi pi-user' },
        { label: "Info", icon: 'pi pi-info-circle' },
        { label: "Commission", icon: 'pi pi-percentage' },
        { label: "Notification", icon: 'pi pi-bell' },
        { label: "Security", icon: 'pi pi-shield' },
        { label: "Help", icon: 'pi pi-question-circle' }
    ];

    useEffect(() => {
        const getData = async () => {
            if (user) {
                setIsLoading(true);
                try {
                    const hotelResponse = await fetchHotelDetails(user.id_etablissement);
                    setNameHotel(hotelResponse.nom_hebergement);
                } catch (error) {
                    console.error('Error fetching hotel details:', error);
                    setNameHotel('Error loading hotel name');
                } finally {
                    setIsLoading(false);
                }
            }
        };
        getData();
    }, [setNameHotel, user]);

    return (
        <div className={style.left_container}>
            <div className={style.left_top_container}>
                <span className={style.left_top_subtitle}>{menuSidebar[menu].label}</span>
                {isLoading ? (
                    <Skeleton width="200px" height="2rem" />
                ) : (
                    <span className={style.left_top_title}>{nameHotel || 'No Name'}</span>
                )}
            </div>
            <div className={style.left_body_container}>
                {menuSidebar.map((item, index) => (
                    <Button
                        key={index}
                        onClick={() => router.push(`/responsable/accommodation/setting/${item.label.toLowerCase()}`)}
                        text
                        className={`${menu === index ? "button-secondary" : style.text_button} ${style_profile.button_edit}`}
                        raised={menu === index}
                        label={item.label}
                        icon={item.icon}
                    />
                ))}
            </div>
        </div>
    );
}

