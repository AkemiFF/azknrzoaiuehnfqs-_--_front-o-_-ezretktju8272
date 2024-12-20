
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

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(sitemap);
}