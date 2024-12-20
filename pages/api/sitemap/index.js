
export default async function handler(req, res) {

    const sitemap = [
        {
            url: 'https://craft-aftrip.com/users',
            lastModified: new Date().toISOString().split('T')[0],
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: 'https://craft-aftrip.com/users/accommodation',
            lastModified: new Date().toISOString().split('T')[0],
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: 'https://craft-aftrip.com/users/tour',
            lastModified: new Date().toISOString().split('T')[0],
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: 'https://craft-aftrip.com/users/about',
            lastModified: new Date().toISOString().split('T')[0],
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: 'https://craft-aftrip.com/users/privacy',
            lastModified: new Date().toISOString().split('T')[0],
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: 'https://craft-aftrip.com/users/register',
            lastModified: new Date().toISOString().split('T')[0],
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: 'https://craft-aftrip.com/users/login',
            lastModified: new Date().toISOString().split('T')[0],
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: 'https://craft-aftrip.com/users/faq',
            lastModified: new Date().toISOString().split('T')[0],
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: 'https://craft-aftrip.com/users/forgot',
            lastModified: new Date().toISOString().split('T')[0],
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: 'https://craft-aftrip.com/users/etablissement/login',
            lastModified: new Date().toISOString().split('T')[0],
            changeFrequency: 'weekly',
            priority: 0.7,
        },
    ];


    let sitemapXml = '<?xml version="1.0" encoding="UTF-8"?>';
    sitemapXml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    sitemap.forEach((url) => {
        sitemapXml += `<url>`;
        sitemapXml += `<loc>${url.url}</loc>`;
        sitemapXml += `<lastmod>${url.lastModified}</lastmod>`;
        sitemapXml += `<changefreq>${url.changeFrequency}</changefreq>`;
        sitemapXml += `<priority>${url.priority}</priority>`;
        sitemapXml += `</url>`;
    });

    sitemapXml += '</urlset>';
    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(sitemapXml);
}