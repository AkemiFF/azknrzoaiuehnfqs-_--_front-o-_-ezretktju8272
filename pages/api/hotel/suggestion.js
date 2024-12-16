import suggestions from './../data/suggestions.json';
export default async function handler(req, res) {
   res.status(200).json(suggestions);
}
