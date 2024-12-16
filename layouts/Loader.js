import { Image } from 'primereact/image'
import style from './../style/layouts/loader.module.css'
import { ProgressSpinner } from 'primereact/progressspinner'
export default function Loader() {
    return(
        <div className={style.container}>
            <div className={style.loader_container}>
                <Image src='/images/logo-aftrip.png' alt='logo' imageClassName={style.image}/>
                <ProgressSpinner style={{width: '100px', height: '100px'}} strokeWidth="3" fill="transparent" animationDuration=".5s" />
            </div>
        </div>
    )
}