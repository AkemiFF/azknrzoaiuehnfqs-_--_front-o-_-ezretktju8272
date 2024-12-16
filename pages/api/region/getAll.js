import regions from './../data/regions.json';
export default async function handler(req, res) {
   res.status(200).json(regions);
}
