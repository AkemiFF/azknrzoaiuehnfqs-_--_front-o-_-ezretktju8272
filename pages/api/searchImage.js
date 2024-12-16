// pages/api/searchImages.js
export default async function handler(req, res) {
    const { city } = req.query;
  
    if (!city) {
      return res.status(400).json({ error: 'City name is required' });
    }
  
    const apiKey = process.env.UNSPLASH_ACCESS_KEY;
    const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(city)}&client_id=${apiKey}`;
  
    try {
      const response = await fetch(searchUrl);
      const data = await response.json();
  
      if (!data.results) {
        return res.status(404).json({ error: 'No images found' });
      }
  
      const images = data.results
      .filter(item => item.width >= 1600 && item.height >= 900 && item.width > item.height)  // Filtrer par résolution et orientation
      .map(item => ({
        url: item.urls.raw,
        title: item.alt_description,
        width: item.width,
        height: item.height
      }));

    res.status(200).json(images);
      res.status(200).json(images);
    } catch (error) {
      console.error('Error fetching images:', error);
      res.status(500).json({ error: 'Error fetching images' });
    }
  }
  