import ResponsableLayoutContext from '@/layouts/context/responsableLayoutContext';
import style from '@/style/pages/responsable/accommodation/setting.module.css';
import style_profile from "@/style/pages/responsable/accommodation/setting/profil.module.css";
import fetchHotelDetails from '@/util/HotelDetails';
import { Button } from "primereact/button";
import { useContext, useEffect, useState } from 'react';

export default function SideBarMenu(props) {
    const { user, setUser } = useContext(ResponsableLayoutContext);
    const [nameHotel, setNameHotel] = useState()
    const menuSidebar = [
        { label: "Profil" },
        { label: "Info" },
        { label: "Commission" },
        { label: "Notification" },
        { label: "Security" },
        { label: "Help" }
    ];

    const menu = props.menu

    useEffect(() => {
        const getData = async () => {
            const hotelResponse = await fetchHotelDetails(user.id_etablissement);
            setNameHotel(hotelResponse);
        }
        if (user) {
            getData();
        }
    }, [user]);



    return (
        <div className={style.left_container}>
            <div className={style.left_top_container}>
                <span className={style.left_top_subtitle}>{menuSidebar[props.menu].label}</span>
                <span className={style.left_top_title}>{nameHotel?.nom_hebergement || 'No Hotel Name'}</span>
            </div>
            <div className={style.left_body_container}>
                {menuSidebar.map((item, index) => (
                    <Button
                        key={index}
                        onClick={() => router.push("/responsable/accommodation/setting/" + item.label.toLowerCase())}
                        text
                        className={`${menu == index ? "button-secondary" : style.text_button} ${style_profile.button_edit}`}
                        raised={menu == index}
                        label={item.label}
                    />
                ))}
            </div>
        </div>
    )
}
