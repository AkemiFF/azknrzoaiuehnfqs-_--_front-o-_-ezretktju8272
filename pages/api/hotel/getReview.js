import reviews from './../data/reviews.json';
export default async function handler(req, res) {
   res.status(200).json(reviews);
}
