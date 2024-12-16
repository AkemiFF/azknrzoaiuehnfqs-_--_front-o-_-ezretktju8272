import typeHebergement from './../data/typeHebergement.json';
export default async function handler(req, res) {
   res.status(200).json(typeHebergement);
}
