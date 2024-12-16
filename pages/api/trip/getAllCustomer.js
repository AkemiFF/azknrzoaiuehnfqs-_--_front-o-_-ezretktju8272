import data from '../data/customer_trip.json';
export default function handler(req,res) {
    res.status(200).json(data);
}