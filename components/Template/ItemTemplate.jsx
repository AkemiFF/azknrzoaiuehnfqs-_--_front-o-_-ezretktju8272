import styles from '@/style/pages/users/ItemTemplate.module.css';
import UrlConfig from "@/util/config";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { Rating } from "primereact/rating";
import { Tag } from "primereact/tag";
import React from 'react';


export const itemTemplate = (
  product
  ,
  index
) => {
  return (
    <div className={`p-d-flex p-mb-4 ${styles.bookingCard}`}>
      <div className="p-d-flex p-shadow-2 p-border-round">
        <div className={`${styles.imageContainer} p-d-flex p-ai-center`}>
          <Image
            src={`${product.chambre_reserve.images_chambre[0]
              ? UrlConfig.apiBaseUrl +
              product.chambre_reserve.images_chambre[0].images
              : "/images/artisanat/aucun_image.jpeg"
              }`}
            alt={product.name}
            width="200"
            height="150"
            className={styles.roomImage}
          />
        </div>
        <div className="p-d-flex p-flex-column p-p-4 p-flex-grow-1">
          <div className="p-d-flex p-jc-between p-ai-start p-mb-3">
            <div>
              <h3 className="p-text-xl p-mb-2">{product.chambre_reserve.chambre.type_chambre} Room</h3>
              <p className="p-text-lg p-text-secondary p-m-0">{product.hebergement.nom_hebergement}</p>
            </div>
            <Tag
              value={`${product.date_debut_reserve} - ${product.date_fin_reserve}`}
              severity="info"
              className={styles.dateTag}
            />
          </div>
          <div className="p-d-flex p-ai-center p-mb-3">
            <Rating
              value={product.hebergement.nombre_etoile_hebergement}
              readOnly
              cancel={false}
              className="p-mr-2"
            />
            <span className="p-text-sm p-text-secondary">
              ({product.hebergement.nombre_etoile_hebergement} stars)
            </span>
          </div>
          <div className="p-d-flex p-jc-between p-ai-end p-mt-auto">
            <div className="p-d-flex p-ai-center">
              <i className="pi pi-map-marker p-text-secondary p-mr-2"></i>
              <span className="p-text-secondary">Location details</span>
            </div>
            <div className="p-d-flex p-ai-center">
              <span className={`p-text-xl p-font-bold p-mr-4 ${styles.price}`}>
                ${product.prix_total_reserve}
              </span>
              <Button
                icon="pi pi-info-circle"
                className="p-button-rounded p-button-outlined"
                tooltip="View Details"
                tooltipOptions={{ position: "top" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
