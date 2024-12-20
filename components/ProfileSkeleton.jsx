
import style from '@/style/pages/users/Profile.module.css';
import { Skeleton } from 'primereact/skeleton';

function ProfileSkeleton() {
    return (
        <>
            <div className={style.profil_image_container}>
                <div className={style.profil_image_wrapper}>
                    <Skeleton shape="circle" size="10rem" className={style.profil_image} />
                    <div className={style.profil_user_info}>
                        <Skeleton width="150px" className="mb-2"></Skeleton>
                        <Skeleton width="100px" className="mb-2"></Skeleton>
                    </div>
                </div>
                <Skeleton width="100px" height="36px"></Skeleton>
            </div>
            <div className={style.separateur}></div>
            <div className={style.profil_detail_container}>
                <div className={style.profil_detail}>
                    <Skeleton width="200px" className="mb-4"></Skeleton>
                    <div className={style.profil}>
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className={style.detail}>
                                <Skeleton width="100px" className="mb-2"></Skeleton>
                                <Skeleton width="200px" className="mb-2"></Skeleton>
                            </div>
                        ))}
                    </div>
                </div>
                <Skeleton width="100px" height="36px"></Skeleton>
            </div>
        </>
    );
}

export default ProfileSkeleton;