<?php
/**
 * Proxy PHP pour l'API GNews.io
 * Contourne les restrictions CORS et met en cache les résultats.
 *
 * ====================================================
 *  CONFIGURATION : Remplacez YOUR_API_KEY_HERE par
 *  votre clé API gratuite obtenue sur https://gnews.io/
 * ====================================================
 */

// ─── Configuration ───────────────────────────────────
$API_KEY    = 'eb7461a47a67424584150e9d96430618';  // ⬅️ Remplacez par votre clé API GNews
$TOPIC      = 'technology';
$LANG       = 'fr';
$COUNTRY    = 'fr';
$MAX        = 6;
$CACHE_TIME = 3600; // Cache de 1 heure (en secondes)
$CACHE_FILE = __DIR__ . '/news_cache.json';

// ─── Headers CORS ────────────────────────────────────
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// ─── Vérification de la clé API ──────────────────────
if ($API_KEY === 'YOUR_API_KEY_HERE') {
    // Mode démo : retourner des articles fictifs pour la démonstration
    echo json_encode([
        'articles' => [ ],
    ]);
    exit;
}

// ─── Vérifier le cache ───────────────────────────────
if (file_exists($CACHE_FILE)) {
    $cacheAge = time() - filemtime($CACHE_FILE);
    if ($cacheAge < $CACHE_TIME) {
        $cached = file_get_contents($CACHE_FILE);
        if ($cached !== false) {
            echo $cached;
            exit;
        }
    }
}

// ─── Appel API GNews ─────────────────────────────────
$url = sprintf(
    'https://gnews.io/api/v4/top-headlines?topic=%s&lang=%s&country=%s&max=%d&apikey=%s',
    urlencode($TOPIC),
    urlencode($LANG),
    urlencode($COUNTRY),
    $MAX,
    urlencode($API_KEY)
);

$context = stream_context_create([
    'http' => [
        'method' => 'GET',
        'timeout' => 10,
        'header' => 'User-Agent: Portfolio-BTS-SIO/1.0'
    ]
]);

$response = @file_get_contents($url, false, $context);

if ($response === false) {
    http_response_code(502);
    echo json_encode([
        'error' => 'Impossible de contacter l\'API GNews.',
        'details' => 'Vérifiez votre connexion Internet et votre clé API.'
    ]);
    exit;
}

// ─── Valider la réponse ──────────────────────────────
$data = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE || !isset($data['articles'])) {
    http_response_code(502);
    echo json_encode([
        'error' => 'Réponse invalide de l\'API GNews.',
        'details' => $response
    ]);
    exit;
}

// ─── Sauvegarder le cache ────────────────────────────
file_put_contents($CACHE_FILE, $response, LOCK_EX);

// ─── Retourner les données ───────────────────────────
echo $response;
