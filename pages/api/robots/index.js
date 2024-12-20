export default function handler(req, res) {
    res.status(200).json({
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/dashboard/', '/admin/'],
        },
        sitemap: 'https://craft-aftrip.com/sitemap.xml',
    });
}
