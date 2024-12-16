import social from './../data/social.json';
export default function handler(req,res) {
    res.status(200).json(social);
}