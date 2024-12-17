import UrlConfig from "./config";
import { getResponsableAccessToken } from "./Cookies";

const fetchHotelDetails = async (id_hebergement) => {
    // Obtenir le token d'accès
    const accessToken = await getResponsableAccessToken();

    try {
        // Appel API pour récupérer les détails de l'hébergement
        const hotelResponse = await fetch(`${UrlConfig.apiBaseUrl}/api/hebergement/get-id-hebergement/${id_hebergement}/`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`, // Ajouter le token d'accès dans l'en-tête
            }
        });

        // Vérifier la réponse de l'API
        if (!hotelResponse.ok) {
            throw new Error('Failed to fetch hotel details');
        }

        const hotelData = await hotelResponse.json();

        return hotelData;
    } catch (error) {
        console.error('Error fetching hotel details:', error.message);
    }
};

export default fetchHotelDetails;