import https from 'https';

const SITE_URL = 'https://hylten.github.io/Alpha';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

const pingEngines = () => {
    console.log(`📡 Pinging search engines for Sitemap: ${SITEMAP_URL}`);

    const bingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    const googleUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;

    const pings = [
        { name: 'Bing', url: bingUrl },
        { name: 'Google (Legacy Ping)', url: googleUrl }
    ];

    pings.forEach(engine => {
        https.get(engine.url, (res) => {
            console.log(`✓ ${engine.name} notified. Status: ${res.statusCode}`);
        }).on('error', (err) => {
            console.error(`- Failed to notify ${engine.name}: ${err.message}`);
        });
    });
};

pingEngines();
