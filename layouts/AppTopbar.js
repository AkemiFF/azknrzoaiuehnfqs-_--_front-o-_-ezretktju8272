import style from '@/style/layouts/AppTopbar.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LayoutContext from './context/layoutContext';
import { useContext, useRef, useState } from 'react';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { Sidebar } from 'primereact/sidebar';
import { Divider } from 'primereact/divider';
import { removeAccessClient, removeAllAdminAccess } from '@/util/Cookies';

export default function AppTopbar(props) {
    const { t } = useTranslation();
    const router = useRouter();
    const menu = useRef(null);
    const menuLang = useRef(null);
    const { user, setUser } = useContext(LayoutContext);
    const { lang, setLang } = useContext(LayoutContext);

    const [sidebarVisible, setSidebarVisible] = useState(false);

    const langMenu = [
        { label: "En", command: () => setLang("en") },
        { label: "Fr", command: () => setLang("fr") }
    ];

    const getLabelAvatar = (str) => {
        return str && str.length > 0 ? str.charAt(0) : '';
    };

    const logOut = () => {

        Cookies.remove("aofdimnnfiodfsnlmaiaftripacciop__");
        Cookies.remove("profile_user");
        Cookies.remove("username");
        Cookies.remove("fdsqomnnkoegnlfnoznflzaftripkfdsmorefi_");
        localStorage.removeItem('adminUser');

        removeAllAdminAccess();
        removeAccessClient();

        router.push("/users");

        setUser(null);
    };

    const items = [
        { label: t("profil"), icon: 'pi pi-fw pi-user', command: () => router.push("/users/profil") },
        { label: t("shopping_cart"), icon: 'pi pi-fw pi-shopping-cart', command: () => router.push("/users/cart") },
        { label: `${t("setting")}s`, icon: 'pi pi-fw pi-cog', command: () => router.push("/users/setting") },
        { separator: true },
        { label: t("log_out"), icon: 'pi pi-sign-out', command: logOut }
    ];

    return (
        <>
            <div style={props.style} className={!props.home ? style.container : style.container_home}>
                <div className={style.navbar}>
                    <div className={style.nav_title}>
                        <Link href={"/users"}>
                            <Image imageClassName={style.nav_image} src={"/images/logo-aftrip.png"} alt='logo' />
                        </Link>
                    </div>
                    <Button onClick={() => setSidebarVisible(true)} className={style.button_bar} icon="pi pi-bars" />
                    <div className={style.navbar_menu_container}>
                        <Link style={{ textDecoration: "none" }} href={"/users"}>
                            <span className={style.navbar_menu_item}>{t("home")}</span>
                        </Link>
                        <Link style={{ textDecoration: "none" }} href={"/users/accommodation"}>
                            <span className={style.navbar_menu_item}>{t("accommodation")}</span>
                        </Link>
                        <Link style={{ textDecoration: "none" }} href={"https://shoplg.online/users"}>
                            <span className={style.navbar_menu_item}>{t("Shop")}</span>
                        </Link>
                        <Link style={{ textDecoration: "none" }} href={"/users/tour"}>
                            <span className={style.navbar_menu_item}>{t("tour")}</span>
                        </Link>
                        <Link style={{ textDecoration: "none" }} href={"/users/about"}>
                            <span className={style.navbar_menu_item}>{t("about_us")}</span>
                        </Link>
                    </div>
                    <div className={style.right_container}>
                        <Button onClick={(e) => menuLang.current.toggle(e)} className={style.icon_cog} label={lang} />
                        <Menu ref={menuLang} model={langMenu} popup />
                        {user == null && (
                            <div className={style.nav_right}>
                                <div className={style.button_group}>
                                    <button onClick={() => router.push("/users/login")} className='button-secondary'>{t("login")}</button>
                                    <button onClick={() => router.push("/users/register")} className={props.home ? 'button-secondary' : 'button-primary'}>{t("register")}</button>
                                    <button onClick={() => router.push("/users/etablissement/addEmail")} className={props.home ? 'button-secondary' : 'button-primary'}>+ Add etablissement</button>
                                </div>
                            </div>
                        )}
                        {user != null && (
                            <>
                                <div aria-controls="popup_menu_right" aria-haspopup onClick={(event) => menu.current.toggle(event)} className={style.user_container}>
                                    <Avatar
                                        label={getLabelAvatar(user.username)}
                                        shape='circle'
                                        className={style.username_image}
                                        image={user.userImage}
                                    />
                                    <span className={style.username}>{user.username}</span>
                                </div>
                                <Menu
                                    className={style.menu}
                                    id="popup_menu_right"
                                    popupAlignment="right"
                                    ref={menu}
                                    model={items}
                                    popup
                                    pt={{
                                        label: { className: style.menu_item },
                                        icon: { className: style.menu_item },
                                        menuitem: { className: style.menu_item_container }
                                    }}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Sidebar position='right' onHide={() => setSidebarVisible(false)} visible={sidebarVisible}>
                <div className={style.sidebar_container}>
                    <Link className={style.sidebar_link} href={"/users"}>
                        <span className={style.navbar_menu_item}>{t("home")}</span>
                    </Link>
                    <Link className={style.sidebar_link} href={"/users/accommodation"}>
                        <span className={style.navbar_menu_item}>{t("accommodation")}</span>
                    </Link>
                    <Link className={style.sidebar_link} href={"https://shoplg.online/users"}>
                        <span className={style.navbar_menu_item}>{t("Shop")}</span>
                    </Link>
                    <Link className={style.sidebar_link} href={"/users/tour"}>
                        <span className={style.navbar_menu_item}>{t("tour")}</span>
                    </Link>
                    <Link className={style.sidebar_link} href={"/users/about"}>
                        <span className={style.navbar_menu_item}>{t("about_us")}</span>
                    </Link>
                    <Divider />
                    {user == null && (
                        <>
                            <Link className={style.sidebar_link} href={"/users/login"}>
                                <span className={style.navbar_menu_item}>{t("login")}</span>
                            </Link>
                            <Link className={style.sidebar_link} href={"/users/register"}>
                                <span className={style.navbar_menu_item}>{t("register")}</span>
                            </Link>
                            <Link className={style.sidebar_link} href={"/users/etablissement/addEmail"}>
                                <span className={style.navbar_menu_item}>Add etablissement</span>
                            </Link>
                        </>
                    )}
                    {user != null && (
                        <><Link href={"/users/profil"} className={style.sidebar_profil}>
                            <Avatar
                                label={getLabelAvatar(user.username)}
                                shape='circle'
                                className={style.username_image}
                                image={user.userImage} />
                            <span>{user.username}</span>
                        </Link>
                            <Button className={style.sidebar_link} onClick={logOut}>
                                <span className={style.navbar_menu_item}>{t("log_out")}</span>
                            </Button>
                        </>
                    )}



                </div>


            </Sidebar>
        </>
    );
}