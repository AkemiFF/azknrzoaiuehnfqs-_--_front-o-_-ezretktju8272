
# EndPoints

## admin Artisanat

* (GET) pour <http://localhost:3000/responsable/handcraft/customer>

`/api/artisanat/1/clients/`

* (GET / POST) produits

`/api/artisanat/{id_artisanat}/produits/`

* (PUT) produits

`/api/artisanat/{id_artisanat}/produits/{id_produit}/`

* Forme de donnée pour produits

        {
            "nom_produit_artisanal": "",
            "description_artisanat": "",
            "prix_artisanat": null,
            "disponible_artisanat": false,
            "poid_kg": null,
            "largeur": null,
            "hauteur": null,
            "nb_produit_dispo": null,
            "artisanat": null,
            "specifications": [id, id, id],
            "likes": []
        }

* (GET) list de tout les endpoints

`/api/artisanat/specifications/`

## admin accomodation

* Login Responsable (POST)

`/api/accounts/responsable/login/`

* GET reservations pour <http://localhost:3000/responsable/accommodation/booking> :

`/api/hebergement/reservations/{id_hebergement}/`

* GET pour list client-reservation pour <http://localhost:3000/responsable/accommodation/guest> :

`/api/hebergement/clients-et-chambres/{id_hebergement}/`

* detail du responsable (GET, PATCH)

`/api/accounts/detail-responsable/{id_responsable}/`

* detail etablissement (GET, PUT, PATCH)

`/api/hebergement/info/{id_hebergement}/`

PUT rah anova ny information rehetra
PATCH rah misy zavatra ts niova

* Detail guest

`/api/hebergement/client-reservations/{id_client}/hebergement/{id_hebergement}/`

### Dashboard accomodation

* Total booking + Avaliable room + Total guest (GET)
`/api/hebergement/{id_hebergement}/stats/`

* Nombre reservation par jour de la semaine (GET)
`/api/hebergement/reservations-by-day/{id_hebergement}/`

* Booking par mois (GET)
`/api/hebergement/{id_hebergement}/reservations/mois/`

* Recent Bookings (GET)
`/api/hebergement/{id_hebergement}/recent-reservations/`

## admin tour

* liste voyages avec liste clients qui ont résérvé (/responsable/tour/travelers) (GET)

`/api/tour/{id_tour}/voyages/`

* pour /responsable/tour/trip (GET)

`/api/tour/{id_tour}/list-voyages/`

* Mise à jour voyage (tsisy sary)

`/api/tour/voyages/{id_voyage}/update-voyage/`

Format de donnée m ise à jour voyage  (afaka ts fenoina)

    {
        "nom_voyage": "Voyage en Europe",
        "ville_depart": "Antananarivo",
        "description_voyage": "Un voyage exceptionnel à travers l'Europe.",
        "destination_voyage": "Europe",
        "date_debut": "2024-09-01",  // Format YYYY-MM-DD
        "date_fin": "2024-09-15",    // Format YYYY-MM-DD
        "prix_voyage": 1500,
        "places_disponibles": 20,
        "type_transport": 4,  // ID du type de transport
        "distance": 900,
        "inclusions": [
        1,5,4
        ]
    }

### Ajout Voyage

* /responsable/tour/addTrip (POST)

`/api/tour/voyages/create/`

* List ana inclusion (GET) (akana ID inclusion ho ampidirina ao ambany)

`/api/tour/inclusions/`

#### / Format de donnée (ny information ihany, mbola tsisy sary)

    {
        "nom_voyage": "Tour Aventure",
        "ville_depart": "Paris",
        "destination_voyage": "Londres",
        "description_voyage": "Un voyage excitant de Paris à Londres avec des visites guidées.",
        "date_debut": "2024-09-01",
        "date_fin": "2024-09-07",
        "distance": 1200,
        "prix_voyage": 500,
        "places_disponibles": 20,
        "type_transport": 1,
        "inclusions": [1, 2],  // IDs anleh inclusions ataov sous forme ana liste otrzao
        "tour_operateur": 1    // ID du tour opérateur
    }

#### / Ajout Trajet de voyage

`/api/tour/voyages/{id_voyage}/create-trajet/`

    {
        "nom_ville": "Paris",
        "date_trajet": "2024-09-05",
        "description_trajet": "Départ de Paris vers la prochaine destination."
    }

#### / Ajout image (POST)

`voyages/{voyage_id}/add-images/`

-- alefa sous forme `formData` le sary réf créé le voyage :

    const formData = new FormData();

    images.forEach((image) => {
        formData.append('images', image);
    });

## dashboard TOUR

* Stats le eo amleh vo miditra (GET)

`/api/tour/{id_tour}/stats/`

* GET total résérvation par mois (les 12 mois de l'année)

`/api/tour/1/monthly-reservations/`

* Les résérvations les plus récentes (GET)

`/api/tour/{id_tour}/recent-reservations/`

# Coté client

* Panier

`/api/artisanat/client-panier/`

# super-admin

* GET list responsable par type (1 accomodation, 2 handcraft, 3 tour)

`/api/accounts/responsables/type/{id_hebergement}/`

* GET detail du responsable

`/api/accounts/detail-responsable/{id_hebergement}/`

* Ajout artisanat

`/api/artisanat/create/`
