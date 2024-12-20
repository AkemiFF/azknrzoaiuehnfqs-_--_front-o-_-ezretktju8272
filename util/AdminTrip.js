import UrlConfig from "./config";
import { getResponsableAccessToken } from "./Cookies";

export const handleAddImage =  async (x, id, t) => {
    
    try {
        // Attendre l'access token
        const access = await getResponsableAccessToken();

        // Faire l'appel à l'API pour ajouter la chambre
        const response = await fetch(`${UrlConfig.apiBaseUrl}/api/tour/voyages/${id}/add-images/`, {
            method: 'POST',

            headers: { 
                
            },
            body: x
        });

        const data = await response.json();

        if (response.ok) {
            t.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Trip added successfully',
                life: 2000
            });
        } else {
            throw new Error(data.message || 'Failed to add trip');
        }
        return data;
    } catch (error) {
        console.error('Error:', error);

    }
}

export const handleAddTrip = async (tripData) => {
    
    try {
        // Attendre l'access token
        const access = await getResponsableAccessToken();

        // Faire l'appel à l'API pour ajouter la chambre
        const response = await fetch(`${UrlConfig.apiBaseUrl}/api/tour/voyages/create/`, {
            method: 'POST',

            headers: { 
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tripData)
        });

        const data = await response.json();

        if (response.ok) {
            /* toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Trip added successfully',
                life: 2000
            }); */

            // Réinitialiser les champs après un délai
            
        } else {
            throw new Error(data.message || 'Failed to add trip');
        }
        return data;
    } catch (error) {
        console.error('Error:', error);
        /* toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add trip',
            life: 3000
        }); */
    }
};