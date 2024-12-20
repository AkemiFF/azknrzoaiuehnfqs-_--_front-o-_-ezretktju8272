
import style from '@/style/components/card/PopularTripCard.module.css';
import { Skeleton } from 'primereact/skeleton';
import React from 'react';
export const OperatorCardSkeleton = () => {
  return (
    <div className={style.operator}>
      <Skeleton
        width="400px" height="250px"
      />
      <div className={style.operator_detail}>
        <span><Skeleton width="30px" height="18px" /></span>
      </div>
    </div>
  );
}

