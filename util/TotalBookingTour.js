import UrlConfig from "./config";

const totalBookingTour = async () => {
    try {
        // Requête pour obtenir les réservations mensuelles
        const response = await fetch(`${UrlConfig.apiBaseUrl}/api/tour/1/monthly-reservations/`);

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        const monthsMap = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        // Transformez les données reçues pour les utiliser dans le graphique
        const labels = monthsMap; // Les noms des mois
        const dataValues = monthsMap.map((_, index) => data.monthly_reservations[index + 1]); // Correspond aux valeurs des réservations

        // Retournez les données au format compatible avec Chart.js
        return {
            labels: labels,
            datasets: [
                {
                    label: "Booking",
                    backgroundColor: "#D4E4E2",
                    borderColor: "#D4E4E2",
                    data: dataValues
                }
            ]
        };
    } catch (error) {
        console.error("Erreur lors de la récupération des réservations :", error);
        return {
            labels: [],
            datasets: []
        };
    }
};

// Export de la fonction
export default totalBookingTour;
