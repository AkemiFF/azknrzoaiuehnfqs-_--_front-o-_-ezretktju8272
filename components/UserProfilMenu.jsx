import style from '@/style/pages/users/Profile.module.css';
import Link from "next/link";




export default function UserProfilMenu({ active }) {
    return (
        <div className={style.menu_container}>
            <Link style={{ textDecoration: "none" }} href={"/users/profil"}>
                {active == "Profil" ? (
                    <span className={style.menu_active}><i className="pi pi-user" /> Profil</span>
                ) : (
                    <span className={style.menu_item}><i className="pi pi-user" /> Profil</span>
                )}
            </Link>
            <Link style={{ textDecoration: "none" }} href={"/users/profil/history"}>
                {active == "History" ? (
                    <span className={style.menu_active}><i className="pi pi-clock" /> History</span>
                ) : (
                    <span className={style.menu_item}><i className="pi pi-clock" /> History</span>
                )}
            </Link>
            <Link style={{ textDecoration: "none" }} href={"/users/profil/notification"}>
                {active == "Notification" ? (
                    <span className={style.menu_active}><i className="pi pi-bell" /> Notification</span>
                ) : (
                    <span className={style.menu_item}><i className="pi pi-bell" /> Notification</span>
                )}
            </Link>
            <Link style={{ textDecoration: "none" }} href={"/users/profil/setting"}>
                {active == "Setting" ? (
                    <span className={style.menu_active}><i className="pi pi-cog" /> Setting</span>
                ) : (
                    <span className={style.menu_item}><i className="pi pi-cog" /> Setting</span>
                )}
            </Link>
            <Link style={{ textDecoration: "none" }} href={"/users/login"}>
                {active == "Log out" ? (
                    <span className={style.menu_active}><i className="pi pi-sign-out" /> Log out</span>
                ) : (
                    <span className={style.menu_item}><i className="pi pi-sign-out" /> Log out</span>
                )}
            </Link>
        </div>
    );
}

