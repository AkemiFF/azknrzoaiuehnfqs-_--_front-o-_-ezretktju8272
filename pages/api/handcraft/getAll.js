import data from './../data/handcraf_product.json';
export default function handler(req,res) {
    res.status(200).json(data);
}