<?php
header('Content-Type: application/json; charset=utf-8');

$cacheFile = __DIR__ . '/news_cache.json';

// Si le cache existe et a moins d'1 heure (3600s), on l'affiche instantanément
if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < 3600)) {
    readfile($cacheFile);
    exit;
}

// Flux RSS Google News — Sujet : Intelligence Artificielle
$rssUrl = 'https://news.google.com/rss/search?q=Intelligence+Artificielle&hl=fr&gl=FR&ceid=FR:fr';
$xml = @simplexml_load_file($rssUrl);

if (!$xml) {
    http_response_code(500);
    echo json_encode(['error' => 'Impossible de charger le flux RSS']);
    exit;
}

$articles = [];
foreach ($xml->channel->item as $item) {
    if (count($articles) >= 6) break;

    $articles[] = [
        'title'  => (string) $item->title,
        'link'   => (string) $item->link,
        'date'   => date('d/m/Y', strtotime((string) $item->pubDate)),
        'source' => (string) ($item->source ?: 'Google News')
    ];
}

$json = json_encode($articles);
file_put_contents($cacheFile, $json);
echo $json;
