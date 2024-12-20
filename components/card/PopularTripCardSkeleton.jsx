import style from '@/style/components/card/PopularTripCard.module.css';
import { Skeleton } from 'primereact/skeleton';
import React from 'react';

export default function PopularTripCardSkeleton() {
  return (
    <div className={style.container}>
      <Skeleton width="320px" height="239px" className={style.image} />
      <div className={style.wrapper}>
        <div className={style.title_container}>
          <div className={style.title_wrapper}>
            <Skeleton width="80%" height="24px" className={style.title} />
            <Skeleton width="60%" height="18px" className={style.subtitle} />
          </div>
          <Skeleton width="70%" height="18px" className={style.position} />
        </div>
        <Skeleton width="100%" height="70px" className={style.label} />
        <Skeleton width="100%" height="40px" className={style.button} />
      </div>

      <div className={style.distance}>
        <Skeleton width="14px" height="14px" shape="circle" />
        <Skeleton width="60px" height="18px" />
      </div>
      <div className={style.like}>
        <Skeleton width="14px" height="14px" shape="circle" />
        <Skeleton width="30px" height="18px" />
      </div>
    </div>
  );
}

