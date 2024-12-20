
export default async function handler(req, res) {
    const sitemap = [
        {
            url: 'https://craft-aftrip.com',
            lastModified: new Date().toISOString(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: 'https://craft-aftrip.com/users',
            lastModified: new Date().toISOString(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: 'https://craft-aftrip.com/users/accommodation',
            lastModified: new Date().toISOString(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: 'https://craft-aftrip.com/users/tour',
            lastModified: new Date().toISOString(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: 'https://craft-aftrip.com/users/about',
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        // Ajoutez des routes dynamiques ici, par exemple :
        // ...tours.map((tour) => ({
        //   url: `https://craft-aftrip.com/tour/${tour.slug}`,
        //   lastModified: new Date(tour.updatedAt).toISOString(),
        //   changeFrequency: 'weekly',
        //   priority: 0.7,
        // })),
    ];


    let sitemapXml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemapXml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    sitemap.forEach((url) => {
        sitemapXml += `<url>\n`;
        sitemapXml += `<loc>${url.url}</loc>\n`;
        sitemapXml += `<lastmod>${url.lastModified}</lastmod>\n`;
        sitemapXml += `<changefreq>${url.changeFrequency}</changefreq>\n`;
        sitemapXml += `<priority>${url.priority}</priority>\n`;
        sitemapXml += `</url>\n`;
    });

    sitemapXml += '</urlset>';
    res.setHeader("Content-Type", "application/xml");
    res.status(200).json(sitemapXml);
}