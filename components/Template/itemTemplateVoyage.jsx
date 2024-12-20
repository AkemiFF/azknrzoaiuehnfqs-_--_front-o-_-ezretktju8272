const { Button } = require("primereact/button");
const { Image } = require("primereact/image");
const { Tag } = require("primereact/tag");

export const itemTemplateVoyage = (reservation, index) => {
    const imageUrl = reservation.voyage.images.find(image => image.couverture)?.image || "/images/artisanat/aucun_image.jpeg";
    const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${UrlConfig.apiBaseUrl}${imageUrl}`;

    return (
        <div key={reservation.id} className="col-12 mb-4">
            <div className="flex flex-column md:flex-row shadow-2 p-4 border-round">
                <Image
                    src={fullImageUrl}
                    alt={reservation.voyage.nom_voyage}
                    width="200"
                    height="200"
                    className="w-full md:w-200px flex-shrink-0 border-round"
                />
                <div className="flex-1 flex flex-column md:flex-row md:justify-content-between md:align-items-center xl:align-items-start p-4 gap-4">
                    <div className="flex flex-column align-items-center md:align-items-start gap-3">
                        <div className="text-2xl font-bold">{reservation.voyage.nom_voyage}</div>
                        <div className="text-xl">{reservation.voyage.ville_depart} to {reservation.voyage.destination_voyage}</div>
                        <Tag value={`${reservation.voyage.date_debut} - ${reservation.voyage.date_fin}`} severity="info" />
                        <span className="flex align-items-center gap-2">
                            <i className="pi pi-users"></i>
                            <span className="font-semibold">{reservation.nombre_voyageurs} Traveler(s)</span>
                        </span>
                    </div>
                    <div className="flex flex-row md:flex-column justify-content-between align-items-center md:align-items-end gap-4 md:gap-2">
                        <span className="text-2xl font-semibold">${reservation.prix_total}</span>
                        <Button icon="pi pi-info" className="p-button-rounded" />
                    </div>
                </div>
            </div>
        </div>
    );


};