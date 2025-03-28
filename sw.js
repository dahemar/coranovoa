const CACHE_NAME = 'cora-novoa-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/obra.html',
    '/bio.html',
    '/aldan.html',
    '/curaduria.html',
    '/contacto.html',
    '/junicode.webfont/junicode_regular.woff2',
    '/junicode.webfont/junicode_bold.woff2',
    '/fonts/demo-atbserif-it.otf'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
    );
}); 