
export default async function handler(req, res) {
    const sitemap = [
        {
            url: 'https://craft-aftrip.com',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: 'https://craft-aftrip.com/accommodation',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: 'https://craft-aftrip.com/tour',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: 'https://craft-aftrip.com/shop',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: 'https://craft-aftrip.com/about',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        // Add dynamic routes here
        // ...tours.map((tour) => ({
        //   url: `https://craft-aftrip.com/tour/${tour.slug}`,
        //   lastModified: new Date(tour.updatedAt),
        //   changeFrequency: 'weekly' as const,
        //   priority: 0.7,
        // })),
    ]
    let sitemapXml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemapXml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    sitemap.forEach((url) => {
        sitemapXml += `<url>\n`;
        sitemapXml += `<loc>${url.loc}</loc>\n`;
        sitemapXml += `<lastmod>${url.lastmod}</lastmod>\n`;
        sitemapXml += `<changefreq>${url.changefreq}</changefreq>\n`;
        sitemapXml += `<priority>${url.priority}</priority>\n`;
        sitemapXml += `</url>\n`;
    });

    sitemapXml += '</urlset>';
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(sitemapXml);
}